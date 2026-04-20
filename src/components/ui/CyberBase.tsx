import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  glow?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = (props) => {
  const { children, variant = 'primary', glow = true, className, ...rest } = props;
  
  const variants = {
    primary: 'bg-primary text-background font-bold hover:bg-primary/90',
    secondary: 'bg-surface-highest text-on-surface hover:bg-surface-high',
    outline: 'border border-primary/50 text-primary hover:bg-primary/10',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      className={cn(
        'px-6 py-4 rounded-xl font-display uppercase tracking-widest text-sm transition-all duration-300',
        variants[variant],
        glow && variant === 'primary' && 'glow-primary',
        className
      )}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
};

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={cn('glass-card p-6 relative overflow-hidden group', className)}>
      {/* Subtle corner light effect */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
