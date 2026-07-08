import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Sparkles, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: string[];
  isWelcome?: boolean;
}

interface ChatViewProps {
  videoId: string;
}

const ChatView: React.FC<ChatViewProps> = ({ videoId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! 👋 I've processed the transcript for this video. Ask me anything about the lecture, key formulas, or code snippets, and I'll search the context to help you study!",
      isWelcome: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSourcesIdx, setOpenSourcesIdx] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    // 1. Add user message
    const newMessages = [...messages, { role: 'user', text: userText } as Message];
    setMessages(newMessages);
    setLoading(true);

    try {
      // 2. Build history (exclude welcome message)
      const chatHistory = newMessages
        .filter(msg => !msg.isWelcome)
        .slice(0, -1) // exclude the current query message we just added
        .map(msg => ({
          role: msg.role,
          text: msg.text
        }));

      // 3. Request RAG backend endpoint
      const response = await axios.post(
        `http://localhost:5000/api/chat/${videoId}`,
        {
          question: userText,
          history: chatHistory
        },
        { withCredentials: true }
      );

      // 4. Append AI response
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: response.data.answer,
          sources: response.data.sources
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[570px] relative">
      {/* Messages Window */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[85%] space-y-1.5">
                  {/* Message Bubble */}
                  <div
                    className={`px-4.5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm font-medium ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                    }`}
                  >
                    {!isUser && !msg.isWelcome && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                        <Sparkles size={10} className="text-blue-500" />
                        <span>AI Tutor</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Collapsible Vector Sources (RAG Chunks) */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="pl-1">
                      <button
                        onClick={() => setOpenSourcesIdx(openSourcesIdx === idx ? null : idx)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <BookOpen size={12} />
                        <span>{openSourcesIdx === idx ? 'Hide Referenced Context' : 'Show Referenced Context'}</span>
                      </button>

                      <AnimatePresence>
                        {openSourcesIdx === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-1.5 space-y-1"
                          >
                            {msg.sources.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500 font-semibold leading-relaxed italic"
                              >
                                Source {sIdx + 1}: "... {src.trim()} ..."
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-100 border border-slate-200/50 rounded-2xl rounded-bl-none px-4.5 py-3.5 flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={16} />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AI is reading transcript...</span>
            </div>
          </motion.div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle size={16} className="text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="border-t border-slate-100 pt-3 bg-white mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this lecture video..."
          className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-semibold text-sm transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatView;
