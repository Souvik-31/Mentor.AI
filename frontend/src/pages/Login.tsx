import React from 'react';
import { Play, Mail } from 'lucide-react';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="max-w-md mx-auto pt-20">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500 mb-8">Sign in to save your progress and track your learning.</p>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 tracking-widest">Or</span></div>
          </div>

          <button className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
            <Mail size={20} />
            Continue with Email
          </button>
        </div>
        
        <p className="mt-8 text-sm text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
