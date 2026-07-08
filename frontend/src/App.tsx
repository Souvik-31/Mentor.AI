import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import VideoView from './pages/VideoView';
import SemPrep from './pages/SemPrep';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

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
                <Route path="/video/:videoId" element={<div className="container mx-auto px-4 py-8"><VideoView /></div>} />
                <Route path="/semprep" element={<div className="container mx-auto px-4 py-8"><SemPrep /></div>} />
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
