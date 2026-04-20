import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Video, CreditCard, Shield, LogOut, ChevronRight, Share2, BadgeCheck, TrendingUp } from 'lucide-react';
import { USER_DATA } from '../data/mockData';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';

export const ProfilePage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-10"
    >
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center space-y-6 pt-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary glow-primary">
            <div className="w-full h-full rounded-full border-4 border-background overflow-hidden">
              <img src={USER_DATA.avatar} alt={USER_DATA.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-background p-1.5 rounded-full border-2 border-background glow-primary">
            <BadgeCheck size={20} fill="currentColor" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight">{USER_DATA.name}</h2>
          <p className="text-primary font-medium tracking-widest text-xs uppercase opacity-80">@alex_repurposer</p>
        </div>

        <div className="flex gap-4">
          <CyberButton variant="primary" className="px-10 py-3 text-xs">
            Edit Profile
          </CyberButton>
          <button className="w-12 h-12 flex items-center justify-center bg-surface-high rounded-xl text-primary border border-outline/20 hover:bg-surface-highest transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        <GlassCard className="col-span-2 flex flex-col items-center justify-center space-y-2">
          <span className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-black">AI Credits Remaining</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-on-surface">420</span>
            <span className="text-on-surface-variant text-sm font-medium">/ 1000</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full mt-2 overflow-hidden border border-outline/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '42%' }}
              className="h-full bg-primary glow-primary"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-2">
          <span className="text-on-surface-variant text-[8px] uppercase tracking-widest font-bold">Videos</span>
          <span className="text-2xl font-black text-primary">1,284</span>
          <div className="flex items-center gap-1 text-[8px] text-primary/70">
            <TrendingUp size={10} />
            <span>Top 5%</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-2">
          <span className="text-on-surface-variant text-[8px] uppercase tracking-widest font-bold">Clips</span>
          <span className="text-2xl font-black text-tertiary">5,912</span>
          <div className="flex items-center gap-1 text-[8px] text-tertiary/70">
            <TrendingUp size={10} />
            <span>+12% mo</span>
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
            { icon: <CreditCard size={18} />, label: "Subscription", color: "text-primary", badge: "PRO PLAN" },
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
      <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-sm text-on-surface">Delete Workspace</h4>
          <p className="text-[10px] text-on-surface-variant">Permanently remove all video data and connected accounts.</p>
        </div>
        <button className="text-red-500 text-[10px] uppercase tracking-widest font-black border border-red-500/30 py-2 rounded-lg hover:bg-red-500 hover:text-background transition-colors">
          Deactivate Project
        </button>
      </div>
    </motion.div>
  );
};
