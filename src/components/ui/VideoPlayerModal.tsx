import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Loader2, CheckCircle2, Play, Video, ExternalLink } from 'lucide-react';
import { GlassCard, CyberButton } from './CyberBase';

interface Clip {
  id: string;
  title: string;
  videoUrl?: string;
  segmentTime?: string;
  duration?: string;
}

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: Clip | null;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ isOpen, onClose, clip }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    setIsDownloading(false);
    setDownloadProgress(0);
    setIsDownloaded(false);
    setIsRendering(true);
    
    if (isOpen) {
      const timer = setTimeout(() => setIsRendering(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [clip?.id, isOpen]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setIsDownloaded(false);

    try {
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 5;
        });
      }, 100);

      const downloadUrl = `http://localhost:3001/api/download/${clip?.id || 'temp'}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CreatorSync_${clip?.title?.replace(/\s+/g, '_') || 'Clip'}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
        setIsDownloaded(true);
      }, 500);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  if (!clip) return null;

  const videoId = clip.videoUrl ? (clip.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/) || [])[1] : null;
  const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}&t=${clip.segmentTime?.replace(':', 'm') + 's'}` : '#';

  const mockMp4Url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/98 backdrop-blur-3xl z-[200]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none p-4 sm:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto w-full max-w-[1100px] aspect-square sm:aspect-auto sm:h-[80vh] relative"
            >
              <GlassCard className="h-full flex flex-col lg:flex-row p-0 overflow-hidden border-primary/30 shadow-[0_0_100px_rgba(255,0,255,0.15)]">
                
                {/* VIDEO AREA */}
                <div className="flex-1 lg:flex-[1.4] bg-black relative flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isRendering ? (
                      <motion.div 
                        key="rendering"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4 p-10 text-center"
                      >
                         <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">AI Rendering Engine</p>
                            <p className="text-[8px] text-on-surface-variant/40 uppercase tracking-widest font-bold">Optimizing for Vertical Playback</p>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full relative flex items-center justify-center bg-surface-low"
                      >
                         <div className="h-full aspect-[9/16] relative bg-black shadow-2xl overflow-hidden group">
                            <video 
                              src={mockMp4Url} 
                              className="w-full h-full object-cover"
                              autoPlay 
                              loop 
                              muted 
                              playsInline
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                            
                            <div className="absolute top-6 left-6 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                               <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">4K AI UPSCALE</span>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                               <p className="text-white text-base font-black leading-tight mb-2 drop-shadow-lg">"{clip.title}"</p>
                               <div className="flex flex-wrap gap-2">
                                  <div className="px-2 py-0.5 rounded bg-primary/20 border border-primary/40 text-[7px] font-black text-primary uppercase">Active</div>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CONTROLS AREA */}
                <div className="w-full lg:w-[400px] bg-surface-low/95 backdrop-blur-3xl p-8 lg:p-12 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5">
                  <div className="flex justify-between items-start mb-8 lg:mb-12">
                    <div className="space-y-2">
                       <h3 className="text-xl lg:text-3xl font-display font-black tracking-tighter uppercase leading-none">{clip.title}</h3>
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-primary" />
                          <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Verified Render</p>
                       </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-8 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-background/40 border border-white/5">
                        <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Duration</p>
                        <p className="text-base font-display font-bold text-primary">{clip.duration}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-background/40 border border-white/5">
                        <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Timestamp</p>
                        <p className="text-base font-display font-bold text-white">@{clip.segmentTime}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       {isDownloading ? (
                         <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-4 shadow-[0_0_30px_rgba(255,0,255,0.05)]">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                               <span className="text-primary flex items-center gap-2">
                                  <Loader2 className="animate-spin" size={12} />
                                  Packaging...
                               </span>
                               <span className="text-on-surface-variant">{Math.round(downloadProgress)}%</span>
                            </div>
                            <div className="h-1 bg-background rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${downloadProgress}%` }}
                                 className="h-full bg-primary glow-primary"
                               />
                            </div>
                         </div>
                       ) : isDownloaded ? (
                         <div className="p-6 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center gap-4">
                            <CheckCircle2 size={24} className="text-green-500" />
                            <div>
                               <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Success</p>
                               <p className="text-[8px] text-green-500/60 font-bold uppercase tracking-wider">File saved</p>
                            </div>
                         </div>
                       ) : (
                         <CyberButton 
                           variant="primary" 
                           className="w-full py-6 text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(255,0,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all group"
                           onClick={handleDownload}
                         >
                           <div className="flex items-center justify-center gap-3">
                              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                              DOWNLOAD MP4
                           </div>
                         </CyberButton>
                       )}

                       <a 
                         href={youtubeUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="w-full py-4 rounded-xl border border-white/10 bg-background/30 flex items-center justify-center gap-2 text-on-surface-variant hover:text-white hover:bg-red-600/10 hover:border-red-600/20 transition-all text-[9px] font-black uppercase tracking-[0.15em] group"
                       >
                         <ExternalLink size={14} />
                         View Source
                       </a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
