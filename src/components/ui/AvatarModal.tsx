import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { AVATAR_OPTIONS } from '../../data/mockData';
import { useUser } from '../../contexts/UserContext';
import { GlassCard } from './CyberBase';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose }) => {
  const { avatar: currentAvatar, setAvatar } = useUser();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <GlassCard className="p-6 relative overflow-hidden border-primary/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-black tracking-tight">CHOOSE <span className="text-primary italic">IDENTITY</span></h3>
                  <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAvatar(url);
                        onClose();
                      }}
                      className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        currentAvatar === url ? 'border-primary glow-primary' : 'border-outline/20 hover:border-primary/50'
                      }`}
                    >
                      <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      {currentAvatar === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-background rounded-full p-1 shadow-lg">
                            <Check size={16} strokeWidth={4} />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-on-surface-variant mt-6 text-center uppercase tracking-[0.2em] font-black opacity-50">
                  Select a new cyber-persona
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
