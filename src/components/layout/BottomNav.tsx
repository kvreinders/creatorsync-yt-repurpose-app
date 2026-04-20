import React from 'react';
import { NavLink } from 'react-router-dom';
import { Video, Zap, User } from 'lucide-react';
import { NAVIGATION } from '../../data/mockData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  User: <User className="w-6 h-6" />,
};

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 bg-[#131313]/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-around px-4 z-50 shadow-2xl">
      {NAVIGATION.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center transition-all duration-300 gap-1",
              isActive ? "text-primary scale-110" : "text-on-surface-variant hover:text-on-surface"
            )
          }
        >
          {iconMap[item.icon]}
          <span className="text-[10px] font-medium uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
