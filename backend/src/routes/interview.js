const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Interview = require('../models/Interview');
const CustomRole = require('../models/CustomRole');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const DEFAULT_ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    skills: 'React, TypeScript, JS, HTML/CSS, Webpack'
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    skills: 'NodeJS, DB Indexing, REST APIs, Scaling, System Design'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Engineer',
    skills: 'JWT Auth, WebSockets, CORS, DevOps, CI/CD'
  },
  {
    id: 'aiml',
    title: 'AI/ML Specialist',
    skills: 'Supervised Learning, Deep Learning, Transformers, NLP, RAG'
  }
];

// Preset suggested questions for each role
const SUGGESTED_QUESTIONS = {
  frontend: [
    "Explain the Virtual DOM and how React's reconciliation works.",
    "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
    "Explain closures in JavaScript and provide a common use case.",
    "How does the 'this' keyword work in JavaScript?",
    "What is state management, and when should we use Redux/Zustand vs. Context API?",
    "Explain the differences between Promise.all, Promise.race, and Promise.allSettled.",
    "How would you optimize a slow-loading web page?",
    "What are modern CSS flexbox and grid layouts, and when to use which?"
  ],
  backend: [
    "What is database indexing, and how does it speed up queries?",
    "Explain the differences between SQL and NoSQL databases, and when to use each.",
    "What are RESTful APIs, and what makes an API truly RESTful?",
    "How do you secure web APIs from common vulnerabilities like OWASP Top 10?",
    "Explain how horizontal scaling differs from vertical scaling.",
    "What is caching, and how would you implement Redis cache for API responses?",
    "How do message queues like RabbitMQ or Kafka help in decoupling microservices?",
    "Explain database transaction isolation levels (ACID)."
  ],
  fullstack: [
    "Explain MVC architecture and how it applies to modern web frameworks.",
    "How do cookies, sessions, and JWT tokens differ for authentication?",
    "What is CORS, and how do you resolve CORS errors in production?",
    "Describe a typical CI/CD pipeline for a full-stack Node/React application.",
    "How do WebSockets differ from HTTP Polling, and when should you use them?",
    "What is Serverless architecture, and what are its pros and cons?",
    "How would you handle rate limiting on a public-facing API?",
    "Explain Git flow and how to resolve a merge conflict in a team."
  ],
  aiml: [
    "Explain the difference between supervised, unsupervised, and reinforcement learning.",
    "What is overfitting, and how do you prevent it in neural networks?",
    "Describe how Backpropagation works in Deep Learning.",
    "What is the Transformer architecture, and how does Self-Attention work?",
    "Explain the difference between L1 and L2 regularization.",
    "What is a RAG (Retrieval-Augmented Generation) pipeline, and what are its key components?",
    "How do you evaluate a classification model (Precision, Recall, F1-Score, ROC-AUC)?",
    "What is the vanishing gradient problem, and how do activation functions like ReLU help?"
  ]
};

// Route: Get available roles (defaults + custom)
router.get('/roles', authenticateJWT, async (req, res) => {
  const userId = req.user._id;

  try {
    const customRoles = await CustomRole.find({ user: userId }).sort({ createdAt: 1 });
    const formattedCustom = customRoles.map(cr => ({
      id: cr.title, // Use title itself as the id so RAG prompt receives the correct role name
      title: cr.title,
      skills: 'Personalized Custom Role',
      isCustom: true
    }));
    res.json([...DEFAULT_ROLES, ...formattedCustom]);
  } catch (error) {
    console.error('Fetch custom roles error:', error);
    res.status(500).json({ error: 'Database fetch error' });
  }
});

// Route: Add a custom role
router.post('/roles', authenticateJWT, async (req, res) => {
  const { title } = req.body;
  const userId = req.user._id;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Role title is required' });
  }

  try {
    // Check if role already exists for user
    const existing = await CustomRole.findOne({ user: userId, title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ error: 'This role already exists' });
    }

    const newRole = await CustomRole.create({
      user: userId,
      title: title.trim()
    });

    res.status(201).json({
      id: newRole.title,
      title: newRole.title,
      skills: 'Personalized Custom Role',
      isCustom: true
    });
  } catch (error) {
    console.error('Create custom role error:', error);
    res.status(500).json({ error: 'Failed to create custom role' });
  }
});

// Route: Get suggested questions for a role
router.get('/suggested/:role', async (req, res) => {
  const { role } = req.params;
  const roleKey = role.toLowerCase();

  if (SUGGESTED_QUESTIONS[roleKey]) {
    return res.json(SUGGESTED_QUESTIONS[roleKey]);
  }

  // Generate on-the-fly suggestions using Gemini
  try {
    const prompt = `
      You are an expert technical recruiter.
      Generate a list of 8 high-frequency, important technical interview questions for the role: "${role}".
      Output ONLY a JSON array of strings. Do not include markdown formatting or backticks.
      Example format:
      ["Question 1", "Question 2", "Question 3"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const questions = JSON.parse(text);
    res.json(questions);
  } catch (err) {
    console.error('Failed to generate suggestions for custom role:', err);
    // Fallback preset
    res.json([
      `Explain the core concepts and frameworks required for a ${role}.`,
      `Describe a challenging architecture or problem you solved as a ${role}.`,
      `What are the security best practices for a ${role}?`,
      `How do you handle scaling and performance optimization as a ${role}?`,
      `What is your process for writing unit and integration tests?`
    ]);
  }
});

// Route: Get Q&A history for a role
router.get('/history/:role', authenticateJWT, async (req, res) => {
  const { role } = req.params;
  const userId = req.user._id;

  try {
    const history = await Interview.find({ user: userId, role: role.toLowerCase() })
      .sort({ askedAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Fetch interview history error:', error);
    res.status(500).json({ error: 'Database fetch error' });
  }
});

// Route: Ask chatbot a question
router.post('/ask', authenticateJWT, async (req, res) => {
  const { role, question, history } = req.body;
  const userId = req.user._id;

  if (!role || !question) {
    return res.status(400).json({ error: 'Role and question are required' });
  }

  try {
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const prompt = `
      You are an expert technical interviewer for the role: ${role}.
      Based on the candidate's question, execute two tasks:
      1. Categorize the question into a specific 1-word or 2-word topic category (e.g. "React Hooks", "Database Indexing", "Transformer Models", "Closures", "CORS").
      2. Provide a detailed, clear, and comprehensive answer to the question suitable for an interview candidate.
      
      Output your response ONLY as a JSON object matching this exact structure:
      {
        "category": "Topic Name",
        "answer": "Detailed answer string formatted in markdown"
      }

      Candidate Question: ${question}
    `;

    // Initialize chat session with structured JSON schema output
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            category: { type: "STRING" },
            answer: { type: "STRING" }
          },
          required: ["category", "answer"]
        }
      }
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseErr) {
      console.error('Gemini JSON parse failed, text:', text);
      parsedResult = {
        category: 'General',
        answer: text
      };
    }

    // Save Q&A to database
    const savedQA = await Interview.create({
      user: userId,
      role: role.toLowerCase(),
      category: parsedResult.category || 'General',
      question,
      answer: parsedResult.answer
    });

    res.json(savedQA);
  } catch (error) {
    console.error('Ask interview question error:', error);
    res.status(500).json({ error: 'Failed to generate interview guide response' });
  }
});

module.exports = router;
