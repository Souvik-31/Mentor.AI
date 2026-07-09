import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Trash2, Loader2, Brain, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/videos/watchlist');
        setWatchlist(res.data);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleRemoveWatchlistItem = async (videoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/api/videos/watchlist/${videoId}`);
      setWatchlist((prev) => prev.filter((item) => item.videoId !== videoId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
            My Watchlist
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Your recently analyzed and studied video lectures
          </p>
        </div>
        <span className="self-start md:self-auto text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900/50">
          {watchlist.length} {watchlist.length === 1 ? 'lecture' : 'lectures'}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
          <p className="text-sm font-semibold text-slate-500">Loading your watchlist history...</p>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-200/60 dark:border-slate-700/60">
            <Brain size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your Watchlist is empty</h3>
          <p className="text-sm text-slate-500 font-semibold mt-2 max-w-md">
            Go to the <Link to="/" className="text-blue-600 hover:underline">Home Dashboard</Link>, paste a YouTube link, and click "Generate Study Guide" to add your first lecture here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <motion.div
              key={item.videoId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/video/${item.videoId}`)}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200/80 dark:hover:border-blue-900/50 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Video Thumbnail */}
              <div className="aspect-video relative overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={item.thumbnail || `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/95 dark:bg-slate-900/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-blue-600 dark:text-blue-400 pl-0.5">
                    <Play size={20} className="fill-current" />
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemoveWatchlistItem(item.videoId, e)}
                  className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-red-650/90 text-white rounded-xl backdrop-blur-sm transition-colors border border-white/10 opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove from watchlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <span>ID: {item.videoId}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>
                      {new Date(item.watchedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
