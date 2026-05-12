# MentorAI - AI-Powered Educational Platform

MentorAI transforms passive video watching into an interactive learning experience. Paste any YouTube URL and get an instant transcript, AI-generated summary, and auto-graded quiz.

## Features
- **AI Transcripts**: Fetched reliably via `youtube_transcript_api`.
- **Smart Summaries**: AI-generated summaries with full markdown rendering.
- **Interactive Quizzes**: Auto-generated 5-question quizzes to test retention.
- **Distraction-Free**: Clean player interface focused on learning.
- **Secure Auth**: Google OAuth & Local Authentication.

## Tech Stack
- **Frontend**: React 19 (Vite), Tailwind CSS v4, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js, MongoDB, Passport.js.
- **AI**: Google Gemini API.
- **Transcript**: Python + `youtube_transcript_api`.

## Prerequisites
- Node.js (v20+ or v22.12+)
- Python (v3.10+)
- MongoDB

## Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd mentorai
```

### 2. Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Install Python dependencies: `pip install -r scripts/requirements.txt`.

### 3. Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

### 4. Running the Application
1. Start the backend: `npm run dev` in the `/backend` directory.
2. Start the frontend: `npm run dev` in the `/frontend` directory.
3. Open your browser to `http://localhost:5173`.

## Environment Variables (Backend)
- `PORT`: Server port (default: 5000).
- `MONGODB_URI`: MongoDB connection string.
- `SESSION_SECRET`: Secret for session management.
- `GEMINI_API_KEY`: Google Gemini API key.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret.
- `CLIENT_URL`: URL of the frontend (default: http://localhost:5173).
- `NODE_ENV`: development or production.
