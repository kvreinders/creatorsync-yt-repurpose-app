import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Loader2, CheckCircle2, Play, Video, ExternalLink, Calendar, Timer, Share2 } from 'lucide-react';
import { GlassCard, CyberButton } from './CyberBase';

interface Clip {
  id: string;
  title: string;
  videoUrl?: string;
  segmentTime?: string;
  duration?: string;
  timestamp?: string;
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
      const timer = setTimeout(() => setIsRendering(false), 1500);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none p-4 md:p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="pointer-events-auto w-full max-w-[1400px] h-full max-h-[900px] relative"
            >
              <GlassCard className="h-full flex flex-col md:flex-row p-0 overflow-hidden border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                
                {/* LEFT: VIDEO AREA (Takes more space on desktop) */}
                <div className="flex-1 md:flex-[2] bg-black relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                  <AnimatePresence mode="wait">
                    {isRendering ? (
                      <motion.div 
                        key="rendering"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-6"
                      >
                         <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Synchronizing Buffers</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full relative group"
                      >
                         <video 
                           src={clip.videoUrl} 
                           className="w-full h-full object-contain"
                           autoPlay 
                           controls
                           loop 
                           playsInline
                         />
                         
                         <div className="absolute top-8 left-8 flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                               <span className="text-[9px] font-black text-white uppercase tracking-widest">AI MASTERED</span>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT: CONTENT & CONTROLS (Sleek panel) */}
                <div className="w-full md:w-[420px] lg:w-[480px] bg-surface-low/30 backdrop-blur-2xl flex flex-col">
                  {/* Header */}
                  <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-start">
                    <div className="space-y-3">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-primary" />
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Ready for Distribution</p>
                       </div>
                       <h3 className="text-2xl lg:text-4xl font-display font-black tracking-tighter uppercase leading-[0.95] text-on-surface">
                          {clip.title}
                       </h3>
                    </div>
                    <button 
                      onClick={onClose} 
                      className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface-variant hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/10 group"
                    >
                      <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Metadata Grid */}
                  <div className="p-8 lg:p-10 flex-1 overflow-y-auto custom-scrollbar space-y-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex items-center gap-2 mb-3 opacity-40 group-hover:opacity-100 transition-opacity">
                           <Timer size={14} className="text-primary" />
                           <p className="text-[8px] font-black uppercase tracking-widest">Duration</p>
                        </div>
                        <p className="text-xl font-display font-bold text-white">{clip.duration}</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex items-center gap-2 mb-3 opacity-40 group-hover:opacity-100 transition-opacity">
                           <Calendar size={14} className="text-tertiary" />
                           <p className="text-[8px] font-black uppercase tracking-widest">Original Time</p>
                        </div>
                        <p className="text-xl font-display font-bold text-white">@{clip.segmentTime}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 ml-1">Actions</h4>
                       <div className="space-y-3">
                          {isDownloading ? (
                            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-4 shadow-[0_0_40px_rgba(255,0,255,0.05)]">
                               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-primary flex items-center gap-3">
                                     <Loader2 className="animate-spin" size={14} />
                                     Encoding MP4...
                                  </span>
                                  <span className="text-primary">{Math.round(downloadProgress)}%</span>
                               </div>
                               <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${downloadProgress}%` }}
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(255,0,255,1)]"
                                  />
                               </div>
                            </div>
                          ) : isDownloaded ? (
                            <div className="p-6 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                                  <CheckCircle2 size={24} />
                               </div>
                               <div>
                                  <p className="text-[11px] font-black text-green-500 uppercase tracking-widest">Export Successful</p>
                                  <p className="text-[9px] text-green-500/50 font-bold uppercase tracking-wider">Asset saved to storage</p>
                               </div>
                            </div>
                          ) : (
                            <CyberButton 
                              variant="primary" 
                              className="w-full py-6 text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(255,0,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all group"
                              onClick={handleDownload}
                            >
                              <div className="flex items-center justify-center gap-3">
                                 <Download size={22} className="group-hover:translate-y-1 transition-transform" />
                                 DOWNLOAD MP4
                              </div>
                            </CyberButton>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                             <a 
                               href={youtubeUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="py-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center gap-2 text-on-surface-variant hover:text-white hover:bg-red-600/20 hover:border-red-600/30 transition-all text-[9px] font-black uppercase tracking-widest group"
                             >
                               <ExternalLink size={16} className="opacity-40 group-hover:opacity-100" />
                               Source
                             </a>
                             <button className="py-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center gap-2 text-on-surface-variant hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all text-[9px] font-black uppercase tracking-widest group">
                               <Share2 size={16} className="opacity-40 group-hover:opacity-100" />
                               Share
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Footer Decoration */}
                  <div className="p-8 lg:p-10 bg-black/20 border-t border-white/5">
                     <p className="text-[8px] font-bold text-on-surface-variant/20 uppercase tracking-[0.5em] text-center italic">
                        Powered by CreatorSync AI Engine v2.4
                     </p>
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
