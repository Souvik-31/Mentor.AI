const { GoogleGenerativeAI } = require('@google/generative-ai');
const Video = require('../models/Video');
require('dotenv').config();

class RAGService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.chatModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.embedModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
  }

  // Split text into chunks with overlap
  chunkText(text, chunkSize = 800, overlap = 200) {
    if (!text) return [];
    const chunks = [];
    let i = 0;
    while (i < text.length) {
      const end = Math.min(i + chunkSize, text.length);
      chunks.push(text.substring(i, end));
      i += chunkSize - overlap;
      if (end === text.length) break;
    }
    return chunks;
  }

  // Get cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Generate embeddings for a list of texts
  async getEmbeddings(texts) {
    try {
      const embeddings = [];
      for (const text of texts) {
        const result = await this.embedModel.embedContent(text);
        embeddings.push(result.embedding.values);
      }
      return embeddings;
    } catch (error) {
      console.error('Embedding Generation Error:', error);
      return [];
    }
  }

  // Perform vector search to retrieve relevant chunks
  async retrieveContext(video, query, k = 3) {
    // 1. Check if chunks/embeddings are cached
    let chunks = video.chunks || [];
    
    if (chunks.length === 0) {
      // Generate chunks
      const chunkTexts = this.chunkText(video.transcript);
      if (chunkTexts.length > 0) {
        const embeddings = await this.getEmbeddings(chunkTexts);
        
        chunks = chunkTexts.map((text, idx) => ({
          text,
          embedding: embeddings[idx] || []
        }));
        
        // Save back to DB
        video.chunks = chunks;
        await video.save();
      }
    }

    if (chunks.length === 0) {
      return { context: video.transcript || '', sources: [] };
    }

    // 2. Embed the query
    try {
      const queryEmbedResult = await this.embedModel.embedContent(query);
      const queryVector = queryEmbedResult.embedding.values;

      // 3. Compute similarity and sort
      const scoredChunks = chunks
        .map(chunk => ({
          text: chunk.text,
          similarity: this.cosineSimilarity(queryVector, chunk.embedding)
        }))
        .filter(c => c.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity);

      // 4. Extract top k
      const topChunks = scoredChunks.slice(0, k);
      const context = topChunks.map(c => c.text).join('\n\n');
      return {
        context,
        sources: topChunks.map(c => c.text)
      };
    } catch (error) {
      console.error('RAG Retrieval error, falling back to full transcript:', error);
      // Fallback: use first 15k chars of transcript
      return {
        context: (video.transcript || '').substring(0, 15000),
        sources: []
      };
    }
  }

  // Answer query using retrieved context and optional chat history
  async answerQuestion(videoId, question, history = []) {
    const video = await Video.findOne({ videoId });
    if (!video) throw new Error('Video not found');

    const { context, sources } = await this.retrieveContext(video, question);

    // Format chat history for Gemini's SDK
    // Gemini chat history expects [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Start a chat session
    const chat = this.chatModel.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      }
    });

    const prompt = `
      You are an intelligent study assistant helping a student understand a video lecture.
      Here is the relevant context from the video transcript:
      ---
      ${context}
      ---
      Answer the user's question accurately using the context above. If the context does not contain enough information to answer the question, use your general knowledge but state that you are answering beyond the transcript. Keep your response clear, structured, and easy for a student to study.

      User Question: ${question}
    `;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const answer = response.text();

    return {
      answer,
      sources
    };
  }
}

module.exports = new RAGService();
