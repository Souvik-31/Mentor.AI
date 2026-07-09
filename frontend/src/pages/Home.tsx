import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Play,
  Search,
  Loader2,
  Sparkles,
  Check,
  Zap,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Brain,
  FileText,
  HelpCircle,
  Award,
  Send,
  X,
  GraduationCap,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  // --- Core Processing State ---
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/videos/process', { videoUrl: url });
      navigate(`/video/${res.data.videoId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process video. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  // --- Smooth scroll hash handler on page load ---
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, []);

  // --- Interactive Mockup States ---
  const [mockTab, setMockTab] = useState<'notes' | 'quiz' | 'cards'>('notes');
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);

  // --- Pricing State ---
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // --- FAQ Accordion State ---
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- Contact Form State ---
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('general');
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSuccess(false), 5000);
    }, 1500);
  };

  // --- Newsletter State ---
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const faqs = [
    {
      q: 'What types of YouTube videos can I process?',
      a: 'You can process any educational video, lecture recording, tech tutorial, or conference talk. For best results, videos with spoken English narration yield the most comprehensive transcripts and summaries.'
    },
    {
      q: 'How does the Semester Preparation (SemPrep) tool work?',
      a: 'Upload your university syllabus and previous year question papers (PYQs) as PDF or images. Our custom AI checks topics against both documents and generates a probable exam paper weighted by question frequency and topic relevance.'
    },
    {
      q: 'Is there a limit on video length for summaries?',
      a: 'Free accounts can process videos up to 30 minutes long. Pro accounts can process videos up to 2.5 hours long, enabling full-length university lectures to be converted into notes.'
    },
    {
      q: 'Can I export my generated notes and quizzes?',
      a: 'Yes, absolutely! With our Pro and Ultimate plans, you can export your study materials as PDF or Markdown files, or save them directly to your student dashboard for offline access.'
    },
    {
      q: 'Is there an academic discount available?',
      a: 'Yes! Students and educators receive a 50% discount on all annual plans. Click the student verification link during the checkout flow to apply the discount.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-24 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl -z-10 animate-pulse duration-4000"></div>
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl -z-10 animate-pulse duration-6000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 text-xs sm:text-sm font-semibold mb-8 shadow-sm"
          >
            <Sparkles size={14} className="animate-spin text-blue-500 duration-3000" />
            <span>Introducing MentorAI 2.0 & Semester Prep Tool</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto mb-6"
          >
            Transform YouTube Videos Into{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Study Guides
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Paste any YouTube lecture link to get AI-powered structured notes, interactive quizzes, flashcards, and a full transcript in seconds.
          </motion.p>

          {/* YouTube input bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mb-16 relative"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[24px] blur-lg opacity-25 group-hover:opacity-40 transition-all duration-300"></div>
            
            <form onSubmit={handleSubmit} className="relative bg-white p-2.5 rounded-[20px] shadow-xl border border-slate-100 flex flex-col sm:flex-row gap-2.5 items-stretch">
              <div className="relative flex-grow flex items-center pl-4">
                <Play className="text-red-500 mr-3 flex-shrink-0 animate-pulse" size={24} />
                <input
                  type="url"
                  placeholder="Paste any YouTube URL (e.g. https://youtube.com/watch?v=...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-semibold focus:outline-none py-3 text-base sm:text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:from-blue-400 disabled:to-indigo-400 disabled:cursor-not-allowed group-hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Generate Free Study Guide</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 mt-3 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold text-sm shadow-sm flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                <span>{error}</span>
              </motion.div>
            )}
          </motion.div>




        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT MOCKUP SECTION */}
      <section className="py-20 bg-slate-900 text-white relative">
        {/* Glow Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Inside MentorAI Study Room
            </h2>
            <p className="text-slate-400 mt-4 text-lg">
              Explore our dashboard features below. Try clicking the tabs to play with the interactive study elements.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto flex flex-col md:h-[650px]">
            {/* Mock Header/Tabs */}
            <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs text-slate-500 font-bold ml-3 bg-slate-800 px-3 py-1 rounded-full border border-slate-700/50">
                  Topic: Deep Learning Demystified.mp4
                </span>
              </div>

              {/* Tab Toggles */}
              <div className="flex gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 w-full sm:w-auto">
                {[
                  { id: 'notes', label: 'AI Notes', icon: FileText },
                  { id: 'quiz', label: 'Interactive Quiz', icon: HelpCircle },
                  { id: 'cards', label: 'Smart Cards', icon: Brain }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setMockTab(t.id as any);
                      if (t.id === 'cards') setCardFlipped(false);
                    }}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mockTab === t.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <t.icon size={14} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Dashboard Body */}
            <div className="flex-grow p-6 sm:p-8 overflow-y-auto min-h-[350px]">
              <AnimatePresence mode="wait">
                {mockTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6 text-slate-300"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <FileText size={20} className="text-blue-500" />
                          Section 1: Foundations of Artificial Intelligence
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Key takeaways generated by AI</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-blue-950 text-blue-400 border border-blue-900 rounded-full font-bold">
                        98% Accuracy
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                        <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1.5">Core Concept</h4>
                        <p className="text-sm sm:text-base text-slate-200">
                          Neural Networks are inspired by biological networks. They consist of layered structures: Input Layer, Hidden Layers (where features are extracted), and an Output Layer.
                        </p>
                      </div>

                      <div className="space-y-3 pl-2">
                        <h4 className="font-bold text-white text-base">Key Technical Terms:</h4>
                        <ul className="space-y-2.5">
                          <li className="flex items-start gap-2.5 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span>
                              <strong className="text-white">Activation Function:</strong> Determines if a neuron should fire. Prevents linearity; examples include ReLU, Sigmoid, and Tanh.
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span>
                              <strong className="text-white">Backpropagation:</strong> The mathematical engine. Uses the chain rule of calculus to calculate errors in the output and update node weights from right to left.
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            <span>
                              <strong className="text-white">Loss Function:</strong> Computes the error distance between predicted and actual values. (e.g., Mean Squared Error or Cross-Entropy).
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {mockTab === 'quiz' && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="max-w-2xl mx-auto space-y-6"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Question 3 of 5</span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        What mechanism does backpropagation use to calculate the gradient of the loss function?
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {[
                        { text: 'A) The Chain Rule of Calculus', correct: true },
                        { text: 'B) Linear Interpolation', correct: false },
                        { text: 'C) Randomized Clustering', correct: false },
                        { text: 'D) Fourier Transform Analysis', correct: false }
                      ].map((option, idx) => {
                        let btnBg = 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60';
                        let icon = null;

                        if (quizAnswered !== null) {
                          if (option.correct) {
                            btnBg = 'bg-green-950/80 border-green-500 text-green-200';
                            icon = <Check size={18} className="text-green-400" />;
                          } else if (quizAnswered === idx) {
                            btnBg = 'bg-red-950/80 border-red-500 text-red-200';
                            icon = <X size={18} className="text-red-400" />;
                          } else {
                            btnBg = 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={quizAnswered !== null}
                            onClick={() => setQuizAnswered(idx)}
                            className={`w-full p-4 rounded-xl border text-left font-semibold text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer ${btnBg}`}
                          >
                            <span>{option.text}</span>
                            {icon}
                          </button>
                        );
                      })}
                    </div>

                    {quizAnswered !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center text-sm"
                      >
                        {quizAnswered === 0 ? (
                          <span className="text-green-400 font-bold">✓ Correct! Backpropagation uses the chain rule to recursively calculate partial derivatives.</span>
                        ) : (
                          <span className="text-red-400 font-bold">✗ Incorrect. The correct answer is A. Backpropagation leverages the Chain Rule to calculate errors.</span>
                        )}
                        <button
                          onClick={() => setQuizAnswered(null)}
                          className="block mx-auto mt-2 text-xs font-bold text-blue-500 hover:underline"
                        >
                          Retry Question
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {mockTab === 'cards' && (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="max-w-md mx-auto space-y-6 flex flex-col items-center justify-center h-full min-h-[250px]"
                  >
                    <p className="text-xs text-slate-500 font-bold">Click the card below to flip and reveal the answer</p>

                    <div
                      onClick={() => setCardFlipped(!cardFlipped)}
                      className="w-full h-52 relative cursor-pointer select-none [perspective:1000px]"
                    >
                      <div
                        className="w-full h-full duration-500"
                        style={{
                          transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {/* CARD FRONT */}
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-blue-500/50 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-between"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-800">
                              Machine Learning
                            </span>
                            <Brain size={18} className="text-blue-500" />
                          </div>
                          <p className="text-center font-bold text-base sm:text-lg text-white leading-snug">
                            "What is the core difference between Supervised and Unsupervised Learning?"
                          </p>
                          <p className="text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                            Click to Flip Card
                          </p>
                        </div>

                        {/* CARD BACK */}
                        <div
                          className="absolute inset-0 bg-blue-600 border border-blue-500 rounded-2xl p-6 flex flex-col justify-between"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-bold">
                              AI Explanation
                            </span>
                            <Check size={18} className="text-white" />
                          </div>
                          <p className="text-sm text-slate-100 font-semibold leading-relaxed text-center">
                            Supervised learning relies on labeled training inputs (with ground-truth tags). Unsupervised learning clusters unlabeled data by structure/patterns.
                          </p>
                          <p className="text-center text-[10px] text-blue-200 font-semibold tracking-wider uppercase">
                            Click to Flip Back
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ADVANCED FEATURES GRID SECTION */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Study 10x Faster
              </span>
            </h2>
            <p className="text-slate-500 mt-4 text-lg">
              Say goodbye to hours of pausing and writing notes manually. MentorAI extracts key value directly from the audio track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                color: 'bg-blue-100 text-blue-600',
                title: 'Structured Summaries',
                desc: 'Generate nested chapters, comprehensive summaries, key takeaways, and glossary definitions for any video lecture.'
              },
              {
                icon: Play,
                color: 'bg-red-100 text-red-600',
                title: 'Interactive Transcripts',
                desc: 'Access time-coded transcripts of your video lectures to quickly find and jump to the exact moment you need.'
              },
              {
                icon: MessageSquare,
                color: 'bg-purple-100 text-purple-600',
                title: 'AI Chat Assistant',
                desc: 'Chat directly with your lecture video. Ask follow-up questions, request translations, or clarify confusing concepts.'
              },
              {
                icon: HelpCircle,
                color: 'bg-green-100 text-green-600',
                title: 'Comprehension Quizzes',
                desc: 'Test your understanding with auto-generated multiple-choice questions matching video content.'
              },
              {
                icon: BookOpen,
                color: 'bg-yellow-100 text-yellow-600',
                title: 'Semester Prep (SemPrep)',
                desc: 'Upload syllabus guidelines and past papers to automatically generate customized practice exam sheets.'
              },
              {
                icon: Brain,
                color: 'bg-indigo-100 text-indigo-600',
                title: 'Interview Guide',
                desc: 'Prepare for technical and behavioral interviews with AI-generated questions, feedback, and sample answers.'
              }
            ].map((feat, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border border-slate-200/80 rounded-3xl hover:border-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`p-4.5 rounded-2xl inline-block ${feat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm mb-6`}>
                  <feat.icon size={26} />
                </div>
                <h3 className="font-extrabold text-xl text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm sm:text-base">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS TIMELINE */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-4 text-lg">Getting structured knowledge has never been this straightforward.</p>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-600 via-indigo-400 to-purple-600"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Submit Content Source',
                  desc: 'Paste a YouTube lecture link at the top, or upload exam syllabus and past papers in the SemPrep tab.'
                },
                {
                  step: '02',
                  title: 'AI Processing Network',
                  desc: 'MentorAI extracts audio tracks, performs speech-to-text transcript generation, and structures sections through AI analysis.'
                },
                {
                  step: '03',
                  title: 'Study & Ace Your Exams',
                  desc: 'Interact with quiz questions, study flippable flashcards, review technical definitions, and print question papers.'
                }
              ].map((step, idx) => (
                <div key={idx} className="text-center bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative group hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                    {step.step}
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 mt-4 text-lg">Pick the plan that matches your current semester needs.</p>

            {/* Toggle switch */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-slate-500'}`}>Monthly Billing</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-8 bg-blue-600 rounded-full p-1 transition-colors relative focus:outline-none cursor-pointer"
              >
                <div
                  className="w-6 h-6 bg-white rounded-full shadow-md transition-transform"
                  style={{ transform: billingCycle === 'yearly' ? 'translateX(24px)' : 'translateX(0)' }}
                ></div>
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-slate-500'}`}>Yearly Billing</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free plan */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">Free Sandbox</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-5xl font-black text-slate-900">$0</span>
                  <span className="text-slate-500 ml-1.5 font-semibold">/month</span>
                </div>
                <p className="text-slate-400 text-xs font-medium mt-1.5">No credit card required</p>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">Great for trying out AI note summaries on shorter video lectures.</p>

                <ul className="space-y-4.5 mt-8 border-t border-slate-100 pt-8">
                  {[
                    '5 Lecture Summaries / mo',
                    'Max video duration: 25 mins',
                    'Interactive Quizzes',
                    'Online dashboard access'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                      <Check className="text-blue-500 flex-shrink-0" size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                  {['Export notes as PDF', 'Semester Prep uploads'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-400 line-through">
                      <Check className="text-slate-300 flex-shrink-0" size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#hero"
                className="block text-center w-full mt-10 py-3.5 border-2 border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-sm transition-all"
              >
                Try Free Now
              </a>
            </div>

            {/* Pro plan (Featured) */}
            <div className="bg-slate-950 text-white border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl shadow-blue-900/10">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-400 uppercase tracking-widest">Scholar Pro</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-5xl font-black text-white">
                    {billingCycle === 'monthly' ? '$9' : '$7'}
                  </span>
                  <span className="text-slate-400 ml-1.5 font-semibold">/month</span>
                </div>
                <p className="text-blue-500 text-xs font-bold mt-1.5">
                  {billingCycle === 'yearly' && 'Billed annually ($84 total)'}
                  {billingCycle === 'monthly' && 'Cancel at any time'}
                </p>
                <p className="text-slate-300 text-sm mt-4 leading-relaxed">Perfect for active college students looking to speed up study hours.</p>

                <ul className="space-y-4.5 mt-8 border-t border-slate-800 pt-8">
                  {[
                    'Unlimited Video Summaries',
                    'Max video duration: 2.5 hours',
                    'Interactive Quizzes & Flashcards',
                    'Full PDF & Markdown exports',
                    'Semester Prep: 5 papers/mo',
                    'Priority AI generation queue'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                      <Check className="text-blue-400 flex-shrink-0" size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/login"
                className="block text-center w-full mt-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
              >
                Get Started
              </Link>
            </div>

            {/* Ultimate / Team plan */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">Academic Ultimate</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-5xl font-black text-slate-900">
                    {billingCycle === 'monthly' ? '$29' : '$23'}
                  </span>
                  <span className="text-slate-500 ml-1.5 font-semibold">/month</span>
                </div>
                <p className="text-slate-400 text-xs font-medium mt-1.5">
                  {billingCycle === 'yearly' && 'Billed annually ($276 total)'}
                  {billingCycle === 'monthly' && 'Cancel at any time'}
                </p>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">Ideal for study groups, prep societies, and teachers hosting classes.</p>

                <ul className="space-y-4.5 mt-8 border-t border-slate-100 pt-8">
                  {[
                    'Everything in Scholar Pro',
                    'Group dashboard (up to 5 users)',
                    'Unlimited Semester Prep tools',
                    'Custom AI tutor chatbot response',
                    'Dedicated customer support',
                    'Early access to beta features'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                      <Check className="text-blue-500 flex-shrink-0" size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/login"
                className="block text-center w-full mt-10 py-3.5 border-2 border-slate-800 hover:bg-slate-900 hover:text-white text-slate-800 font-bold rounded-xl text-sm transition-all"
              >
                Go Ultimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-4 text-lg">Have questions about MentorAI? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 text-base sm:text-lg hover:text-blue-600 focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`p-1 bg-slate-100 rounded-lg text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-slate-500 border-t border-slate-50 pt-4 leading-relaxed text-sm sm:text-base">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CONTACT US SECTION */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Details Left */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h2>
                <p className="text-slate-500 mt-4 text-base leading-relaxed">
                  Have inquiries, suggestions, or technical bugs? Contact our support team. We reply to all messages within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Address</h4>
                    <a href="mailto:support@mentor.ai" className="text-slate-500 hover:text-blue-600 text-sm font-semibold transition-colors">
                      souvik.sarkar3103@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Phone</h4>
                    <p className="text-slate-500 text-sm font-semibold">+91 1234567890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">HQ</h4>
                    <p className="text-slate-500 text-sm font-semibold">Mahatma Gandhi Avenue, Durgapur, India</p>
                  </div>
                </div>
              </div>

              {/* Mini Map Placeholder */}
              <div className="bg-slate-100 h-44 rounded-3xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/')] bg-cover opacity-10 bg-slate-300"></div>
                <div className="text-center relative z-10 p-4">
                  <MapPin size={28} className="text-blue-600 mx-auto animate-bounce" />
                  <span className="block mt-2 font-bold text-xs text-slate-700">Palo Alto, California</span>
                </div>
              </div>
            </div>

            {/* Contact Form Right */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-sm relative">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. alex@university.edu"
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Subject Topic</label>
                  <select
                    id="subject"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold transition-all text-sm"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="billing">Billing & Refund</option>
                    <option value="technical">Technical Bug / Issue</option>
                    <option value="partnership">Academic Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-extrabold uppercase tracking-wider text-slate-600">How can we help?</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Write details of your message here..."
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:from-blue-400"
                >
                  {submittingContact ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Success Notification Alert */}
              <AnimatePresence>
                {contactSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Check size={32} />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-slate-500 max-w-sm text-sm">
                      Thank you for contacting us. We have received your query and will reply to your registered email shortly.
                    </p>
                    <button
                      onClick={() => setContactSuccess(false)}
                      className="mt-6 text-sm font-bold text-blue-600 hover:underline focus:outline-none"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MASTERPIECE FOOTER */}
      <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-slate-900">
            {/* Col 1: Brand & Logo */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-blue-500">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <GraduationCap size={22} />
                </div>
                <span className="font-extrabold text-white">MentorAI</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Unlock university lecture content. Our AI structures audio transcripts, designs study material, and parses question paper sets for student semester preparation.
              </p>
              {/* Newsletter Sub */}
              <div className="space-y-2.5">
                <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">Subscribe to Newsletter</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-grow px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
                {subscribed && (
                  <p className="text-xs text-green-400 font-bold">✓ Subscribed successfully! Thank you.</p>
                )}
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Core Features</a></li>
                <li><Link to="/semprep" className="hover:text-blue-400 transition-colors">Semester Prep (SemPrep)</Link></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing Tiers</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">Study Timelines</a></li>
                <li><a href="/login" className="hover:text-blue-400 transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Syllabus Template</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community Discord</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Student Discount</a></li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">GDPR & FERPA</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security Audit</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 text-slate-500 text-xs sm:text-sm font-semibold">
            <p>© {new Date().getFullYear()} MentorAI, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
