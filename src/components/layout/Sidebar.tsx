import React from 'react';
import { NavLink } from 'react-router-dom';
import { Video, Zap, User, Plus } from 'lucide-react';
import { NAVIGATION, USER_DATA } from '../../data/mockData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CyberButton } from '../ui/CyberBase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface border-r border-outline/10 z-50">
      <div className="p-8 space-y-8">
        <h1 className="text-2xl font-display font-black italic tracking-tighter text-primary">CREATORSYNC</h1>
        
        <CyberButton variant="primary" className="w-full py-3 flex items-center justify-center gap-2 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span className="text-[10px]">Create New</span>
        </CyberButton>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAVIGATION.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]" 
                : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
            )}
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              {iconMap[item.icon]}
            </div>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-surface-low rounded-2xl border border-outline/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30">
            <img src={USER_DATA.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate">{USER_DATA.name}</p>
            <p className="text-[10px] text-primary font-bold truncate opacity-70">PRO PLAN</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
