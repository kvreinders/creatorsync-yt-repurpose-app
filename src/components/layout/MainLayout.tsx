import React from 'react';
import { Outlet } from 'react-router-dom';
import { USER_DATA } from '../../data/mockData';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] animate-blob animation-delay-4000" />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Persistent Header (hidden on desktop) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-outline/10 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-lg font-display font-black italic tracking-tighter text-primary">CREATORSYNC</h1>
          <div className="flex items-center gap-3">
            <div className="hidden xs:block text-right">
              <p className="text-[10px] font-black truncate max-w-[80px]">{USER_DATA.name}</p>
              <p className="text-[8px] text-primary font-bold uppercase tracking-widest">{USER_DATA.plan.split(' ')[0]}</p>
            </div>
            <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden bg-surface-high">
              <img src={USER_DATA.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pt-24 pb-32 px-6 md:pt-10 md:pb-10 md:px-12 md:ml-64 max-w-[1600px] mx-auto w-full transition-all">
          <Outlet />
        </main>

        {/* Mobile Navigation (hidden on desktop) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};
