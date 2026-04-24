import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_DATA } from '../data/mockData';
import { useAuth } from './AuthContext';

interface UserContextType {
  avatar: string;
  setAvatar: (url: string) => void;
  name: string;
  plan: string;
  clipCount: number;
  limit: number;
  isAvatarModalOpen: boolean;
  setIsAvatarModalOpen: (open: boolean) => void;
  refreshUsage: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [avatar, setAvatarState] = useState(USER_DATA.avatar);
  const [clipCount, setClipCount] = useState(0);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const planLimits: Record<string, number> = React.useMemo(() => ({
    'Hobby Plan': 3,
    'Agency Plan': 9999,
    'Cyber Rose Premium': 50
  }), []);

  const limit = planLimits[user?.plan || ''] || 3;

  const refreshUsage = React.useCallback(async () => {
    if (user) {
      try {
        const res = await fetch(`http://localhost:3001/api/clips/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setClipCount(data.length);
      } catch (err) {
        console.error('Fetch clips error:', err);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setAvatarState(user.avatar);
      refreshUsage();
    }
  }, [user, refreshUsage]);

  const setAvatar = React.useCallback(async (url: string) => {
    if (user) {
      try {
        const response = await fetch('http://localhost:3001/api/user/avatar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, avatar: url }),
        });
        if (response.ok) {
          setAvatarState(url);
          const updatedUser = { ...user, avatar: url };
          localStorage.setItem('creator_sync_user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Update avatar error:', error);
      }
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      avatar, 
      setAvatar, 
      name: user?.name || USER_DATA.name, 
      plan: user?.plan || USER_DATA.plan,
      clipCount,
      limit,
      isAvatarModalOpen,
      setIsAvatarModalOpen,
      refreshUsage
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
