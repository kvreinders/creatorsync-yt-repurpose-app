import React from 'react';
import { Outlet } from 'react-router-dom';
import { USER_DATA } from '../../data/mockData';
import { BottomNav } from './BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Persistent Header */}
      <header className="fixed top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-40 bg-gradient-to-b from-background to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 glow-primary">
            <img 
              src={USER_DATA.avatar} 
              alt={USER_DATA.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-display font-bold leading-none">{USER_DATA.name}</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">{USER_DATA.plan}</span>
          </div>
        </div>
        
        {/* Optional Logo/Title in Center if needed */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <h1 className="text-lg font-display font-black italic tracking-tighter text-primary">CREATORSYNC</h1>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 pt-24 pb-32 px-6">
        <Outlet />
      </main>

      {/* Fixed Navigation */}
      <BottomNav />
    </div>
  );
};
