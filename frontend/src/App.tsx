import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import Home from './pages/Home';
import VideoView from './pages/VideoView';
import SemPrep from './pages/SemPrep';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-600 font-medium text-lg">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/video/:videoId"
                  element={
                    <ProtectedRoute>
                      <div className="container mx-auto px-4 py-8">
                        <VideoView />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/semprep"
                  element={
                    <ProtectedRoute>
                      <div className="container mx-auto px-4 py-8">
                        <SemPrep />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<div className="container mx-auto px-4 py-8"><Login /></div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
