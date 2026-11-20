const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateSummaryAndQuiz(transcript) {
    const prompt = `
      You are an expert educator. Based on the following video transcript, provide:
      1. A concise summary of the key points in Markdown format.
      2. A 5-question multiple-choice quiz to test retention (4 options each, where correctAnswer matches one of the options).

      Transcript:
      ${transcript}
    `;

    const summaryAndQuizSchema = {
      type: SchemaType.OBJECT,
      properties: {
        summary: {
          type: SchemaType.STRING,
          description: 'Concise Markdown summary of the key points from the video transcript.',
        },
        quiz: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              options: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              correctAnswer: { type: SchemaType.STRING },
            },
            required: ['question', 'options', 'correctAnswer'],
          },
        },
      },
      required: ['summary', 'quiz'],
    };

    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: summaryAndQuizSchema,
        },
      });

      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('AIService Error:', error);
      throw new Error(`Failed to generate summary and quiz: ${error.message}`);
    }
  }

  async generateSemPrep(files, title) {
    const prompt = `
      You are an expert academic examiner. I am providing you with multiple documents which include previous year question papers (PYQs) and a syllabus for the subject: "${title}".
      
      Based on the syllabus and the patterns in the PYQs, generate a probable question paper for the upcoming semester examination.
      
      The question paper should be structured into sections (e.g., Section A: Short Answers, Section B: Long Answers).
    `;

    const semPrepSchema = {
      type: SchemaType.OBJECT,
      properties: {
        sections: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              questions: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    question: { type: SchemaType.STRING },
                    marks: { type: SchemaType.NUMBER },
                    topic: { type: SchemaType.STRING },
                  },
                  required: ['question', 'marks', 'topic'],
                },
              },
            },
            required: ['title', 'questions'],
          },
        },
      },
      required: ['sections'],
    };

    try {
      const parts = [{ text: prompt }];

      for (const file of files) {
        parts.push({
          inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype,
          },
        });
      }

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: semPrepSchema,
        },
      });

      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('AIService SemPrep Error:', error);
      throw new Error(`Failed to generate semester preparation paper: ${error.message}`);
    }
  }
}

module.exports = new AIService();