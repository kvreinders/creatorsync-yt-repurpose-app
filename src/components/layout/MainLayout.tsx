import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { AvatarModal } from '../ui/AvatarModal';

export const MainLayout: React.FC = () => {
  const { avatar, name, plan, isAvatarModalOpen, setIsAvatarModalOpen } = useUser();

  return (
    <div className="min-h-screen bg-background text-on-surface flex relative overflow-hidden font-sans">
      <AvatarModal 
        isOpen={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)} 
      />
      
      {/* Premium Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[180px] animate-blob animation-delay-4000" />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar onAvatarClick={() => setIsAvatarModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 md:pl-64 relative z-10">
        {/* Mobile Persistent Header */}
        <header className="md:hidden flex items-center justify-between p-5 border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-40">
          <h1 className="text-xl font-display font-black italic tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(255,0,255,0.3)]">CREATORSYNC</h1>
          <button 
            onClick={() => setIsAvatarModalOpen(true)}
            className="flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-full border border-primary/40 overflow-hidden bg-surface-high shadow-[0_0_15px_rgba(255,0,255,0.2)]">
              <img src={avatar} alt="User" className="w-full h-full object-cover" />
            </div>
          </button>
        </header>

        {/* Page Content wrapper */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <main className="w-full max-w-[1500px] px-6 md:px-16 pt-12 pb-32 md:py-12 transition-all">
            <Outlet />
          </main>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};
