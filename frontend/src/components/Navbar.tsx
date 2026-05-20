import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut, User, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <GraduationCap size={32} />
          <span>MentorAI</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            to="/semprep" 
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <FileText size={20} />
            <span>SemPrep</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={20} />
                )}
                <span>{user.displayName}</span>
              </div>
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
