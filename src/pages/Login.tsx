import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-dim/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-display font-black italic tracking-tighter text-primary mb-2"
          >
            CREATORSYNC
          </motion.h1>
          <p className="text-on-surface-variant text-xs uppercase tracking-[0.4em] font-black opacity-50">
            Secure Access Gateway
          </p>
        </div>

        <GlassCard className="p-8 border-primary/20 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-on-surface-variant group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background/50 border border-outline/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
                    placeholder="Enter identification"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Access Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-on-surface-variant group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border border-outline/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-500 text-xs font-bold"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <CyberButton 
              type="submit"
              variant="primary" 
              className="w-full py-4 flex items-center justify-center gap-2 group relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="tracking-widest">AUTHENTICATE</span>
                </>
              )}
            </CyberButton>
          </form>


        </GlassCard>

        <p className="mt-8 text-center text-[10px] text-on-surface-variant/40 font-black uppercase tracking-[0.3em]">
          &copy; 2026 CreatorSync Systems • Authorized Entry Only
        </p>
      </motion.div>
    </div>
  );
};
