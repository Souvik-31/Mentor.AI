import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, User, FileText, Menu, X, Sparkles, MessageSquare, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const navLinks = [
    { label: 'Home', target: 'hero', isAnchor: true },
    { label: 'Features', target: 'features', isAnchor: true },
    { label: 'How It Works', target: 'how-it-works', isAnchor: true },
    { label: 'Pricing', target: 'pricing', isAnchor: true },
    { label: 'Contact', target: 'contact', isAnchor: true },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Side: Sidebar Toggle (if logged in) + Logo */}
            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  aria-label="Open Sidebar Menu"
                >
                  <Menu size={24} />
                </button>
              )}

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-blue-600 group">
                <div className="p-2.5 bg-blue-600 text-white rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                  <GraduationCap size={26} />
                </div>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold hover:opacity-90 transition-opacity">
                  MentorAI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={location.pathname === '/' ? `#${link.target}` : `/#${link.target}`}
                    onClick={(e) => handleNavClick(e, link.target)}
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 relative py-1 group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200/60 dark:border-slate-800/60">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.displayName} className="w-6 h-6 rounded-full border border-slate-200" />
                      ) : (
                        <User size={16} />
                      )}
                      <span>{user.displayName}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-sm font-semibold transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 hover:scale-[1.02] transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <Sparkles size={14} />
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button (Only shown when NOT logged in, as logged-in users have Left Sidebar) */}
            {!user && (
              <div className="md:hidden flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 transition-colors"
                  aria-label="Toggle Menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}

            {/* Mobile Profile Display (if logged in, just displays avatar as drawer handle triggers left sidebar) */}
            {user && (
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 overflow-hidden border border-slate-200 cursor-pointer"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Slide-out (Only for Logged-Out Users) */}
        <AnimatePresence>
          {!user && mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={location.pathname === '/' ? `#${link.target}` : `/#${link.target}`}
                      onClick={(e) => handleNavClick(e, link.target)}
                      className="block px-3 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-semibold transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Left Sidebar Drawer (Only for Logged-In Users) */}
      <AnimatePresence>
        {user && sidebarOpen && (
          <>
            {/* Dark Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-8">
                {/* Header / Brand Logo */}
                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2 text-2xl font-black tracking-tight text-blue-600 group"
                  >
                    <div className="p-2 bg-blue-600 text-white rounded-xl">
                      <GraduationCap size={22} />
                    </div>
                    <span className="font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      MentorAI
                    </span>
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-3">
                    Study Center
                  </span>

                  <Link
                    to="/"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                  >
                    <Home size={18} />
                    <span>Home Dashboard</span>
                  </Link>

                  <Link
                    to="/semprep"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                  >
                    <FileText size={18} />
                    <span>Semester Prep (SemPrep)</span>
                  </Link>

                  <Link
                    to="/interview"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                  >
                    <MessageSquare size={18} />
                    <span>Interview Guide</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Profile Section */}
              <div className="border-t border-slate-150 dark:border-slate-800 pt-6 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 overflow-hidden border border-slate-200">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight truncate">
                      {user?.displayName}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold truncate max-w-[170px]">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout Session</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
