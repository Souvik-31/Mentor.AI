import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import VideoView from './pages/VideoView';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video/:videoId" element={<VideoView />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
