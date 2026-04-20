import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Link as LinkIcon, Play, Clock } from 'lucide-react';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';

export const ToolPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Hero Section */}
      <section className="space-y-2">
        <h2 className="text-4xl font-display font-black tracking-tighter text-on-surface leading-tight">
          REPURPOSE <br />
          <span className="text-primary italic">CONTENT</span>
        </h2>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide max-w-[280px]">
          Transform your long-form videos into viral clips with AI precision.
        </p>
      </section>

      {/* Main Action Card */}
      <GlassCard className="p-8">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 glow-primary rotate-3">
            <Wand2 className="text-primary w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold">Select Video Source</h3>
            <p className="text-primary text-[10px] uppercase tracking-[0.2em] font-black">AI Engine Ready</p>
          </div>

          <div className="w-full space-y-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Paste YouTube URL..." 
                className="w-full bg-background/50 border border-outline/30 rounded-xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none"
              />
              <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-outline/10"></div>
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-outline/10"></div>
            </div>

            <CyberButton variant="primary" className="w-full py-5">
              Browse Recent Uploads
            </CyberButton>
          </div>
        </div>
      </GlassCard>

      {/* Active Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-on-surface-variant flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Active Selection
          </h4>
          <span className="text-[9px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Processing
          </span>
        </div>

        <div className="group relative aspect-video rounded-2xl overflow-hidden border border-outline/20 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800" 
            alt="Default Preview" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="max-w-[70%]">
              <p className="text-sm font-display font-bold text-on-surface truncate">My Podcast Episode #42.mp4</p>
              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                <Clock className="w-3 h-3" />
                <span>24:15 • 1080p</span>
              </div>
            </div>
            <button className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center glow-primary hover:scale-110 active:scale-90 transition-all">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      </section>

      {/* Recent History */}
      <section className="space-y-4 pb-10">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Recent Clips</h4>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <GlassCard key={i} className="p-3 bg-surface/50 border-outline/10 hover:border-primary/30 transition-all cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden bg-background mb-3 relative group">
                <img 
                  src={`https://images.unsplash.com/photo-1622737133809-d95047b9e673?auto=format&fit=crop&q=80&w=300&sig=${i}`} 
                  alt="Recent" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary fill-current" />
                   </div>
                </div>
              </div>
              <p className="text-xs font-bold truncate">Viral Clip #{i+102}</p>
              <p className="text-[9px] text-on-surface-variant font-medium">Applied Cyber Rose Style</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
