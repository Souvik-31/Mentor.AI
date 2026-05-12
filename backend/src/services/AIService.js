const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateSummaryAndQuiz(transcript) {
    const prompt = `
      You are an expert educator. Based on the following video transcript, provide:
      1. A concise summary of the key points in Markdown format.
      2. A 5-question multiple-choice quiz to test retention.
      
      Output ONLY a JSON object with this exact structure:
      {
        "summary": "markdown summary string here",
        "quiz": [
          {
            "question": "question text",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "the correct option"
          }
        ]
      }

      Transcript:
      ${transcript}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Basic cleaning of Markdown code blocks if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('AIService Error:', error);
      throw new Error('Failed to generate summary and quiz');
    }
  }
}

module.exports = new AIService();
