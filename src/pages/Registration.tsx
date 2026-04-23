import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Mail, Lock, Github, Chrome } from 'lucide-react';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';
import { Link } from 'react-router-dom';

export const RegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-display font-black italic tracking-tighter text-primary">CREATORSYNC</h1>
          <p className="text-on-surface-variant text-sm font-medium">Join the next generation of content creation.</p>
        </div>

        <GlassCard className="p-8 sm:p-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-background/50 border border-outline/30 rounded-xl py-4 pl-12 pr-6 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full bg-background/50 border border-outline/30 rounded-xl py-4 pl-12 pr-6 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none"
                />
              </div>
            </div>

            <CyberButton variant="primary" className="w-full py-4 text-xs">
              Create Account
            </CyberButton>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-outline/10"></div>
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">or continue with</span>
              <div className="h-[1px] flex-1 bg-outline/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-surface-high rounded-xl border border-outline/20 hover:bg-surface-highest transition-all text-[11px] font-bold">
                <Github size={16} />
                Github
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-surface-high rounded-xl border border-outline/20 hover:bg-surface-highest transition-all text-[11px] font-bold">
                <Chrome size={16} />
                Google
              </button>
            </div>
          </div>
        </GlassCard>

        <p className="text-center mt-8 text-xs text-on-surface-variant">
          Already have an account? <Link to="/auth" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};
