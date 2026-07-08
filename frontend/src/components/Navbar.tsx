import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, User, FileText, Menu, X, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        // Offset scroll for sticky navbar
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
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-blue-600 group">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <GraduationCap size={26} />
            </div>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold hover:opacity-90 transition-opacity">
              MentorAI
            </span>
          </Link>

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

              {user && (
                <>
                  <Link
                    to="/semprep"
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 relative py-1 group"
                  >
                    <FileText size={16} />
                    <span>SemPrep</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>

                  <Link
                    to="/interview"
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-sm font-semibold transition-colors duration-200 relative py-1 group"
                  >
                    <MessageSquare size={16} />
                    <span>Interview Guide</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </>
              )}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {mobileMenuOpen && (
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
                {user && (
                  <>
                    <Link
                      to="/semprep"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <FileText size={18} />
                      <span>SemPrep</span>
                    </Link>

                    <Link
                      to="/interview"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <MessageSquare size={18} />
                      <span>Interview Guide</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="px-3 py-2 text-slate-600 dark:text-slate-300 text-sm font-semibold">
                      Signed in as <span className="text-blue-600 font-bold">{user.displayName}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-base font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
