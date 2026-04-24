import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Download, Share2, Clock, Calendar, Trash2 } from 'lucide-react';
import { GlassCard, CyberButton } from './CyberBase';

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

interface ClipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: Clip[];
  onDelete: (e: React.MouseEvent, id: string) => void;
  onWatch: (clip: Clip) => void;
}

export const ClipsModal: React.FC<ClipsModalProps> = ({ isOpen, onClose, clips, onDelete, onWatch }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="pointer-events-auto w-full max-w-5xl h-full max-h-[85vh] flex flex-col"
            >
              <GlassCard className="flex-1 flex flex-col overflow-hidden border-primary/30 p-0">
                <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-surface-low/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                      <Play className="text-primary w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black tracking-tight uppercase">Clip <span className="text-primary italic">Gallery</span></h3>
                      <p className="text-[10px] text-on-surface-variant font-black tracking-[0.2em] uppercase opacity-50">{clips.length} Assets Found</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {clips.map((clip) => (
                        <motion.div 
                          key={clip.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="group flex flex-col space-y-3 cursor-pointer"
                          onClick={() => onWatch(clip)}
                        >
                          <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-background relative border border-outline/10 group-hover:border-primary/50 transition-all duration-500 shadow-xl">
                            <img 
                              src={clip.thumbnailUrl || `https://images.unsplash.com/photo-1622737133809-d95047b9e673?auto=format&fit=crop&q=80&w=400&sig=${clip.id}`} 
                              alt={clip.title} 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                               <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center shadow-2xl">
                                  <Play className="w-6 h-6 text-primary fill-current" />
                               </div>
                            </div>

                            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                              <button 
                                onClick={(e) => onDelete(e, clip.id)}
                                className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md p-2 rounded-lg border border-red-500/30 transition-all z-10"
                              >
                                <Trash2 size={14} />
                              </button>
                              <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[9px] font-black tracking-widest text-white">
                                {clip.duration}
                              </div>
                              {clip.segmentTime && (
                                <div className="bg-primary/80 backdrop-blur-md px-2 py-1 rounded-md border border-primary/20 text-[8px] font-black tracking-widest text-white">
                                  @ {clip.segmentTime}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="px-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-black truncate pr-4">{clip.title}</h4>
                              <span className="text-[8px] font-black text-primary/60 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10">{clip.style}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-medium">
                              <div className="flex items-center gap-1">
                                <Calendar size={10} />
                                <span>{clip.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="hover:text-primary transition-colors"><Download size={14} /></button>
                                <button className="hover:text-primary transition-colors"><Share2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="p-6 border-t border-outline/10 bg-surface-low/30">
                  <CyberButton variant="outline" className="w-full py-3 text-xs tracking-widest" onClick={onClose}>
                    Close Gallery
                  </CyberButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
