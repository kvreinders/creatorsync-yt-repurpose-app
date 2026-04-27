import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand, Link as LinkIcon, Play, Clock, CheckCircle2, Loader2, Sparkles, Layers, Trash2, Download } from 'lucide-react';
import { ClipsModal } from '../components/ui/ClipsModal';
import { VideoPlayerModal } from '../components/ui/VideoPlayerModal';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';

interface Clip {
  id: string;
  title: string;
  duration: string;
  style: string;
  timestamp: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  segmentTime?: string;
}

export const ToolPage: React.FC = () => {
  const { user } = useAuth();
  const { clipCount, limit, refreshUsage } = useUser();
  const [url, setUrl] = useState('');
  const [requestedClips, setRequestedClips] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('Initializing AI Engine...');
  const [showComplete, setShowComplete] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [activeThumbnail, setActiveThumbnail] = useState<string | null>(null);
  
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  const getYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/clips/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data)) {
            setClips(data);
          }
        })
        .catch(err => console.error('Error fetching clips:', err));
    }
  }, [user]);

  const handleRepurpose = async () => {
    if (!url) return;
    if (clipCount + requestedClips > limit) {
      alert(`Access Restricted: Insufficient credits. Your current plan covers ${limit} clips.`);
      return;
    }
    
    const videoId = getYTId(url);
    if (videoId) {
      setActiveThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }

    setIsProcessing(true);
    setProgress(0);
    setShowComplete(false);

    try {
      // Fake progress increment to keep UI alive
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 1 : prev));
      }, 500);

      const response = await fetch('http://localhost:3001/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          requestedClips,
          userId: user?.id
        }),
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const savedClips = await response.json();
        setProgress(100);
        setClips(prev => [...savedClips, ...prev]);
        refreshUsage();
        
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
          setShowComplete(true);
          setUrl('');
          setTimeout(() => setShowComplete(false), 3000);
        }, 1000);
      } else {
        throw new Error('Failed to repurpose video');
      }
    } catch (error) {
      console.error('Error during repurpose:', error);
      alert('Pipeline Error: Failed to process video. Ensure the link is valid and try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDeleteClip = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/clips/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setClips(prev => prev.filter(c => c.id !== id));
        refreshUsage();
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  const handleWatchClip = (clip: Clip) => {
    setSelectedClip(clip);
    setIsVideoPlayerOpen(true);
  };

  const handleDownloadClip = async (e: React.MouseEvent, clip: Clip) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3001/api/download/${clip.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CreatorSync_${clip.title.replace(/\s+/g, '_')}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-12 lg:grid lg:grid-cols-12 lg:gap-16"
    >
      <div className="lg:col-span-7 space-y-10 flex flex-col justify-center">
        <section className="space-y-6">
          <h2 className="text-4xl sm:text-7xl font-display font-black tracking-tighter text-on-surface leading-[0.9]">
            REPURPOSE <br />
            <span className="text-primary italic drop-shadow-[0_0_30px_rgba(255,0,255,0.4)]">CONTENT</span>
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-lg font-medium tracking-wide max-w-[480px] opacity-70">
            Transform your standard landscape videos into high-engagement vertical assets with our proprietary AI clipping engine.
          </p>
        </section>

        <GlassCard className="p-10 relative overflow-hidden border-primary/20">
          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 ${isProcessing ? 'bg-primary/40 border-primary glow-primary animate-pulse shadow-[0_0_40px_rgba(255,0,255,0.4)]' : 'bg-primary/20 border-primary/30 glow-primary rotate-3'}`}>
              {isProcessing ? <Loader2 className="text-primary w-8 h-8 animate-spin" /> : <Wand className="text-primary w-8 h-8" />}
            </div>
            
            <div className="w-full space-y-8">
              <div className="relative group">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Insert YouTube link here..." 
                  className="w-full bg-background/40 border border-white/10 rounded-2xl py-5 px-8 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none disabled:opacity-50"
                />
                <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              </div>

              {!isProcessing && (
                <div className="space-y-4 px-1">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                    <span className="flex items-center gap-2">
                      <Layers size={14} className="text-primary" />
                      Moment Density
                    </span>
                    <span className="text-primary font-display text-2xl">{requestedClips}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={requestedClips}
                    onChange={(e) => setRequestedClips(parseInt(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {isProcessing ? (
                <div className="w-full space-y-3 pt-4">
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary glow-primary shadow-[0_0_20px_rgba(255,0,255,0.6)]"
                    />
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] text-center animate-pulse">{processingStep}</p>
                </div>
              ) : (
                <CyberButton 
                  variant="primary" 
                  className="w-full py-5 text-[11px] font-black tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(255,0,255,0.2)] hover:scale-[1.01] active:scale-95 transition-all"
                  onClick={handleRepurpose}
                  disabled={!url || isProcessing}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles size={18} />
                    START AI REPURPOSE
                  </div>
                </CyberButton>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-5 space-y-12 flex flex-col justify-center">
        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-on-surface-variant flex items-center gap-2 opacity-60">
              <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-primary animate-pulse' : 'bg-tertiary'}`} />
              {showComplete ? 'ENGINE COMPLETE' : 'ACTIVE PIPELINE'}
            </h4>
          </div>

          <div 
            onClick={() => clips.length > 0 && handleWatchClip(clips[0])}
            className={`group relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-surface-low/50 ${clips.length > 0 && !isProcessing ? 'cursor-pointer hover:border-primary/40 transition-all' : ''}`}
          >
            {activeThumbnail || isProcessing || (clips.length > 0 && clips[0].thumbnailUrl) ? (
               <img 
                 src={isProcessing ? activeThumbnail : (clips.length > 0 ? clips[0].thumbnailUrl : activeThumbnail)} 
                 alt="Preview" 
                 className={`w-full h-full object-cover transition-all duration-1000 ${isProcessing ? 'blur-md scale-110 opacity-30' : 'opacity-60 group-hover:opacity-80 group-hover:scale-105'}`}
               />
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant/20 p-8 text-center space-y-4">
                  <Play size={40} className="opacity-5" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Signal</p>
               </div>
            )}
            
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-2xl border border-primary/30 flex items-center justify-center">
                  <Loader2 size={32} className="text-primary animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{processingStep}</p>
                </div>
              </div>
            )}

            {!isProcessing && clips.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/20">
                <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center">
                  <Play size={32} className="text-primary fill-primary" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6 pb-16">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-on-surface-variant opacity-60">Library Fragments</h4>
            <button onClick={() => setIsGalleryOpen(true)} className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Open Archive</button>
          </div>
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {clips.slice(0, 4).map((clip) => (
                <motion.div
                  key={clip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <GlassCard 
                    onClick={() => handleWatchClip(clip)}
                    className="p-4 bg-white/[0.02] border-white/5 hover:border-primary/40 hover:bg-white/[0.05] transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98] z-10"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black relative shrink-0 border border-white/5 group/thumb">
                        <img 
                          src={clip.thumbnailUrl || `https://images.unsplash.com/photo-1622737133809-d95047b9e673?auto=format&fit=crop&q=80&w=300`} 
                          alt="Thumb" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />
                        <button 
                          onClick={(e) => handleDownloadClip(e, clip)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-primary/60 backdrop-blur-md z-20 group/btn rounded-2xl"
                        >
                           <Download className="w-8 h-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0 pr-10">
                        <p className="text-sm font-black truncate tracking-tight mb-1 group-hover:text-primary transition-colors uppercase">{clip.title}</p>
                        <div className="flex items-center gap-4">
                           <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">
                              {clip.timestamp}
                           </p>
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/60 uppercase">
                              <Clock size={10} />
                              <span>{clip.duration}</span>
                           </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteClip(e, clip.id)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-red-500/5 text-red-500/40 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center z-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <ClipsModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} clips={clips} onDelete={handleDeleteClip} onWatch={handleWatchClip} />
      <VideoPlayerModal isOpen={isVideoPlayerOpen} onClose={() => setIsVideoPlayerOpen(false)} clip={selectedClip} />
    </motion.div>
  );
};
