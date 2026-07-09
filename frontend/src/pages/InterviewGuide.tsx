import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import {
  ArrowLeft,
  Code,
  Server,
  Layers,
  Cpu,
  Send,
  Loader2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
});

interface QAHistoryItem {
  _id: string;
  role: string;
  category: string;
  question: string;
  answer: string;
  askedAt: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ROLES_STATIC = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    skills: 'React, TypeScript, JS, HTML/CSS, Webpack'
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    icon: Server,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    skills: 'NodeJS, DB Indexing, REST APIs, Scaling, System Design'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Engineer',
    icon: Layers,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    skills: 'JWT Auth, WebSockets, CORS, DevOps, CI/CD'
  },
  {
    id: 'aiml',
    title: 'AI/ML Specialist',
    icon: Cpu,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    skills: 'Supervised Learning, Deep Learning, Transformers, NLP, RAG'
  }
];

const InterviewGuide = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [history, setHistory] = useState<QAHistoryItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Role Creator states
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [addingRole, setAddingRole] = useState(false);

  // History UI States
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load available roles (defaults + custom)
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/api/interview/roles');
        const mapped = res.data.map((r: any) => {
          const matchedStatic = ROLES_STATIC.find(sr => sr.id === r.id);
          if (matchedStatic) {
            return { ...r, icon: matchedStatic.icon, color: matchedStatic.color, bgColor: matchedStatic.bgColor, textColor: matchedStatic.textColor };
          }
          return {
            ...r,
            icon: Sparkles,
            color: 'from-teal-500 to-emerald-500',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-600'
          };
        });
        setRoles(mapped);
      } catch (err) {
        console.error('Failed to load roles', err);
      }
    };

    fetchRoles();
  }, [selectedRole]);

  // Load suggested questions and history when role is selected
  useEffect(() => {
    if (!selectedRole) return;

    const loadRoleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sugRes, histRes] = await Promise.all([
          api.get(`/api/interview/suggested/${selectedRole}`),
          api.get(`/api/interview/history/${selectedRole}`)
        ]);
        setSuggestedQuestions(sugRes.data);
        setHistory(histRes.data);
        
        // Initial welcome message
        const roleLabel = roles.find(r => r.id === selectedRole)?.title || selectedRole || 'Technical';
        setMessages([
          {
            role: 'model',
            text: `Welcome to your **${roleLabel} Interview Prep Room**! 🎓\n\nI've generated a set of core questions on the left to test your knowledge. Click on any suggested question, or type your own question below, and I'll explain the concepts.`
          }
        ]);
      } catch (err: any) {
        setError('Failed to load interview guide details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRoleData();
  }, [selectedRole]);

  // Group history items by category
  const groupedHistory = history.reduce((acc: { [key: string]: QAHistoryItem[] }, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Submit custom/suggested question
  const askQuestion = async (questionText: string) => {
    if (!questionText.trim() || loading || !selectedRole) return;

    setError(null);
    setLoading(true);

    // Append user question
    const updatedMessages = [...messages, { role: 'user', text: questionText } as Message];
    setMessages(updatedMessages);

    try {
      // Build history for conversational context
      const chatHistory = updatedMessages
        .slice(1, -1) // Exclude welcome message and current question
        .map(msg => ({
          role: msg.role,
          text: msg.text
        }));

      const res = await api.post(
        '/api/interview/ask',
        {
          role: selectedRole,
          question: questionText,
          history: chatHistory
        }
      );

      // Append AI response
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: res.data.answer
        }
      ]);

      // Prepend to history local state
      setHistory(prev => [res.data, ...prev]);

      // Auto-expand the category of the new question
      const newCat = res.data.category || 'General';
      setOpenCategories(prev => ({
        ...prev,
        [newCat]: true
      }));

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Display previously saved Q&A in the chat window
  const loadSavedQA = (item: QAHistoryItem) => {
    setMessages([
      {
        role: 'model',
        text: `Loaded saved question from **${item.category}** history:`
      },
      {
        role: 'user',
        text: item.question
      },
      {
        role: 'model',
        text: item.answer
      }
    ]);
  };

  const handleRoleReset = () => {
    setSelectedRole(null);
    setSuggestedQuestions([]);
    setHistory([]);
    setMessages([]);
    setError(null);
  };

  const handleAddCustomRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleTitle.trim() || addingRole) return;

    setAddingRole(true);
    setError(null);

    try {
      const res = await api.post(
        '/api/interview/roles',
        { title: customRoleTitle.trim() }
      );

      const newRole = {
        ...res.data,
        icon: Sparkles,
        color: 'from-teal-500 to-emerald-500',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-600'
      };

      setRoles(prev => [...prev, newRole]);
      setCustomRoleTitle('');
      setSelectedRole(newRole.id);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add custom role');
    } finally {
      setAddingRole(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-600 animate-pulse" size={32} />
            <span>Interview Guide</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Ace your developer interviews with AI-powered category-wise explanations and mock sessions.
          </p>
        </div>
        {selectedRole && (
          <button
            onClick={handleRoleReset}
            className="flex items-center gap-1.5 px-4 py-2 border-2 border-slate-200 hover:border-slate-800 rounded-xl text-slate-700 hover:text-slate-900 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Select Another Role</span>
          </button>
        )}
      </div>

      {error && !selectedRole && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2 text-sm font-semibold max-w-xl mx-auto">
          <AlertCircle size={18} className="text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* SCREEN 1: ROLE SELECTOR */}
      {!selectedRole && (
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto pt-10">
            <h2 className="text-2xl font-black text-slate-800">Select Your Target Role</h2>
            <p className="text-slate-500 mt-2 font-semibold">
              Choose a discipline below to load specific high-frequency questions and start the mock prep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon || Sparkles;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="bg-white border-2 border-slate-200/80 hover:border-blue-500 rounded-3xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl ${role.bgColor} ${role.textColor} group-hover:scale-105 transition-transform duration-300 shadow-inner`}>
                      <Icon size={28} />
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={24} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-6 group-hover:text-blue-600 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-semibold mt-2">
                    Focus: {role.skills}
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                    <span>Launch Prep Room</span>
                    <Sparkles size={14} className="animate-pulse" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Target Role Card Form */}
          <div className="max-w-md mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-teal-500 animate-pulse" size={20} />
              <span>Add Custom Target Role</span>
            </h3>
            
            <form onSubmit={handleAddCustomRole} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="custom-role" className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Role Title
                </label>
                <input
                  type="text"
                  id="custom-role"
                  value={customRoleTitle}
                  onChange={(e) => setCustomRoleTitle(e.target.value)}
                  placeholder="e.g. Mobile Developer, Cloud Architect"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-semibold text-sm transition-colors"
                  required
                  disabled={addingRole}
                />
              </div>
              
              <button
                type="submit"
                disabled={addingRole || !customRoleTitle.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {addingRole ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Adding Role...</span>
                  </>
                ) : (
                  <>
                    <span>+ Add & Open Prep Room</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 2: ACTIVE PREP ROOM */}
      {selectedRole && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[700px] items-stretch">
          
          {/* LEFT SIDEBAR: SUGGESTIONS & SAVED HISTORY */}
          <div className="lg:col-span-1 flex flex-col gap-6 max-h-[700px] overflow-y-auto">
            {/* Suggested Questions Block */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col">
              <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <BookOpen size={16} className="text-blue-500" />
                <span>Suggested Questions</span>
              </h3>
              <div className="space-y-2 mt-4 overflow-y-auto max-h-[220px] pr-1">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => askQuestion(q)}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed hover:text-blue-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {idx + 1}. {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Q&A Categories Block */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col flex-grow">
              <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <MessageSquare size={16} className="text-purple-500" />
                <span>Categorized Q&A History</span>
              </h3>
              
              <div className="space-y-3 mt-4 overflow-y-auto max-h-[300px] pr-1 flex-grow scrollbar-thin">
                {Object.keys(groupedHistory).length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-semibold text-sm">
                    No questions asked yet. Ask a question to see it categorized here.
                  </div>
                ) : (
                  Object.keys(groupedHistory).map((cat) => {
                    const isOpen = openCategories[cat];
                    return (
                      <div key={cat} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleCategory(cat)}
                          className="w-full px-4 py-3 bg-slate-50 border-b border-slate-50 flex items-center justify-between text-left font-bold text-slate-800 text-xs sm:text-sm hover:text-blue-600"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {cat}
                          </span>
                          <span>
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </span>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-white"
                            >
                              <div className="p-2 space-y-1.5">
                                {groupedHistory[cat].map((item) => (
                                  <button
                                    key={item._id}
                                    onClick={() => loadSavedQA(item)}
                                    className="w-full text-left p-2.5 rounded-lg text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50/10 font-semibold truncate leading-relaxed block border-b border-slate-50 last:border-b-0 cursor-pointer"
                                    title={item.question}
                                  >
                                    💡 {item.question}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COL: MOCK CHAT INTERACTION */}
          <div className="lg:col-span-2 flex flex-col h-[700px] bg-white rounded-3xl shadow-xl border border-slate-100 p-6 overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin mb-4">
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
                        <div
                          className={`px-4.5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm font-medium ${
                            isUser
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                              : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                          }`}
                        >
                          {!isUser && idx > 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 border-b border-slate-200/60 pb-1">
                              <Sparkles size={10} className="text-blue-500 animate-pulse" />
                              <span>Interview Advisor</span>
                            </div>
                          )}
                          <div
                            className="prose prose-sm max-w-none text-slate-800 dark:prose-invert 
                                       prose-p:my-1 prose-p:leading-relaxed prose-headings:text-slate-900 
                                       prose-headings:font-bold prose-headings:my-2 prose-ul:list-disc 
                                       prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4 prose-strong:font-bold 
                                       prose-code:bg-slate-200/60 prose-code:px-1 prose-code:py-0.5 
                                       prose-code:rounded prose-code:text-[11px] prose-code:font-mono"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(md.render(msg.text))
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 border border-slate-200/50 rounded-2xl rounded-bl-none px-4.5 py-3.5 flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Evaluating Answer...</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle size={16} className="text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Message Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                askQuestion(input);
                setInput('');
              }}
              className="border-t border-slate-100 pt-3 bg-white mt-4 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask a question about ${roles.find((r: any) => r.id === selectedRole)?.title || 'interview'} topics...`}
                className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-semibold text-sm transition-colors"
                disabled={loading}
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
          
        </div>
      )}
    </div>
  );
};

export default InterviewGuide;
