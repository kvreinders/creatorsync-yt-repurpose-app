import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Video, CreditCard, Shield, LogOut, ChevronRight, Share2, BadgeCheck, TrendingUp, Sparkles } from 'lucide-react';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { avatar, name, setIsAvatarModalOpen } = useUser();
  const { user } = useAuth();
  const [clipCount, setClipCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/clips/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setClipCount(data.length);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const planLimits = {
    'Hobby Plan': 3,
    'Agency Plan': 9999,
    'Cyber Rose Premium': 50
  };

  const currentLimit = planLimits[user?.plan as keyof typeof planLimits] || 3;
  const usagePercent = Math.min((clipCount / currentLimit) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-10 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-12"
    >
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center space-y-6 pt-4 lg:col-span-4 lg:text-left lg:items-start lg:sticky lg:top-10 lg:h-fit">
        <button 
          onClick={() => setIsAvatarModalOpen(true)}
          className="relative group active:scale-95 transition-transform"
        >
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary glow-primary group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border-4 border-background overflow-hidden">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 lg:bottom-2 lg:right-2 bg-primary text-background p-1.5 rounded-full border-2 border-background glow-primary">
            <BadgeCheck size={20} fill="currentColor" />
          </div>
        </button>

        <div className="space-y-1">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight">{name}</h2>
            <div className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles size={10} className="text-primary" />
              <span className="text-[8px] font-black uppercase text-primary tracking-tighter">{user?.plan}</span>
            </div>
          </div>
          <p className="text-primary font-medium tracking-widest text-xs uppercase opacity-80">@{user?.username || 'alex_repurposer'}</p>
        </div>

        <div className="flex gap-4 w-full">
          <CyberButton variant="primary" className="flex-1 lg:flex-none px-10 py-3 text-xs">
            Edit Profile
          </CyberButton>
          <button className="w-12 h-12 flex items-center justify-center bg-surface-high rounded-xl text-primary border border-outline/20 hover:bg-surface-highest transition-all shrink-0">
            <Share2 size={20} />
          </button>
        </div>
      </section>

      {/* Stats & Settings Content */}
      <div className="lg:col-span-8 space-y-10">
        {/* Stats Bento Grid */}
        <section className="grid grid-cols-2 gap-4">
          <GlassCard className="col-span-2 flex flex-col items-center justify-center p-8 space-y-2">
            <span className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-black">AI Repurposing Limit</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-black text-on-surface">{clipCount}</span>
              <span className="text-on-surface-variant text-sm font-medium">/ {currentLimit === 9999 ? '∞' : currentLimit}</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full mt-2 overflow-hidden border border-outline/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                className="h-full bg-primary glow-primary"
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">Videos Processed</span>
            <span className="text-3xl font-black text-primary">{Math.floor(clipCount / 1.5)}</span>
            <div className="flex items-center gap-1 text-[10px] text-primary/70">
              <TrendingUp size={12} />
              <span>Current Cycle</span>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">Generated Clips</span>
            <span className="text-3xl font-black text-tertiary">{clipCount}</span>
            <div className="flex items-center gap-1 text-[10px] text-tertiary/70">
              <TrendingUp size={12} />
              <span>Lifetime Growth</span>
            </div>
          </GlassCard>
        </section>

        {/* Settings List */}
        <section className="space-y-4">
          <h3 className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] font-black px-2">Account Management</h3>
          <div className="bg-surface-low rounded-2xl overflow-hidden border border-outline/10 shadow-2xl">
            {[
              { icon: <Settings size={18} />, label: "Account Settings", color: "text-primary" },
              { icon: <Video size={18} />, label: "Connected Channels", color: "text-tertiary", badge: "3 Active" },
              { icon: <CreditCard size={18} />, label: "Subscription", color: "text-primary", badge: user?.plan?.toUpperCase() },
              { icon: <Shield size={18} />, label: "Security", color: "text-on-surface" },
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <button className="w-full flex items-center justify-between p-5 hover:bg-surface-high transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm text-on-surface">{item.label}</span>
                      {item.badge && (
                        <span className="block text-[8px] mt-0.5 text-primary/60 font-black tracking-widest">{item.badge}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </button>
                {idx < 3 && <div className="h-px bg-outline/10 mx-6" />}
              </React.Fragment>
            ))}
            <button className="w-full flex items-center gap-4 p-5 hover:bg-red-500/10 transition-all group border-t border-outline/10">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <LogOut size={18} />
              </div>
              <span className="font-bold text-sm text-red-500">Logout</span>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-on-surface">Delete Workspace</h4>
            <p className="text-[10px] text-on-surface-variant">Permanently remove all video data and connected accounts.</p>
          </div>
          <button className="text-red-500 text-[10px] uppercase tracking-widest font-black border border-red-500/30 px-6 py-3 rounded-lg hover:bg-red-500 hover:text-background transition-colors shrink-0">
            Deactivate Project
          </button>
        </div>
      </div>
    </motion.div>
  );
};
