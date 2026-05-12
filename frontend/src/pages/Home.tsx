import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/videos/process', { videoUrl: url }, { withCredentials: true });
      navigate(`/video/${res.data.videoId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process video. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full text-red-600">
            <Play size={48} />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Transform YouTube into <span className="text-blue-600">Learning</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Paste any YouTube URL and get an instant transcript, AI summary, and interactive quiz.
          No ads, no distractions, just learning.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
          <input
            type="text"
            placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all pr-32"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            <span>Process</span>
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 font-medium bg-red-50 py-2 px-4 rounded-lg inline-block">
            {error}
          </p>
        )}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Smart Summaries', desc: 'Get the essence in seconds with AI-generated key takeaways.' },
            { title: 'Interactive Quizzes', desc: 'Test your knowledge with auto-generated comprehension checks.' },
            { title: 'Full Transcripts', desc: 'Read along or search through the entire video content.' },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-left">
              <h3 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
