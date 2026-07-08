import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, HelpCircle, List, Loader2, MessageSquare } from 'lucide-react';
import SummaryView from '../components/SummaryView';
import QuizView from '../components/QuizView';
import TranscriptView from '../components/TranscriptView';
import ChatView from '../components/ChatView';

const VideoView = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'chat' | 'quiz' | 'transcript'>('summary');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${videoId}`, { withCredentials: true });
        setVideo(res.data);
      } catch (err) {
        console.error('Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-600 font-medium text-lg">Analyzing content and generating insights...</p>
      </div>
    );
  }

  if (!video) return <div>Video not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            <YouTube
              videoId={videoId}
              opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }}
              className="w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{video.title || 'Video Learning Session'}</h1>
        </div>

        {/* Right Column: Interaction Panel */}
        <div className="lg:col-span-1 flex flex-col h-[700px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[
              { id: 'summary', icon: FileText, label: 'Summary' },
              { id: 'chat', icon: MessageSquare, label: 'Ask AI' },
              { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
              { id: 'transcript', icon: List, label: 'Notes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id ? 'text-blue-600 bg-blue-50/50 font-bold' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={20} />
                <span className="text-xs uppercase tracking-wider text-center">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="h-1 w-8 bg-blue-600 rounded-full mt-1" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-h-0 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col min-h-0"
              >
                {activeTab === 'summary' && <div className="overflow-y-auto h-full pr-1"><SummaryView summary={video.summary} /></div>}
                {activeTab === 'chat' && <ChatView videoId={videoId!} />}
                {activeTab === 'quiz' && <div className="overflow-y-auto h-full pr-1"><QuizView quiz={video.quiz} videoId={videoId!} /></div>}
                {activeTab === 'transcript' && <div className="overflow-y-auto h-full pr-1"><TranscriptView transcript={video.transcript} /></div>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;
