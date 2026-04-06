import { useState, useEffect } from 'react';
import { Profile } from '../types';

export const useLives = (profile: Profile | null) => {
  const [lives, setLives] = useState(profile?.lives || 0);

  useEffect(() => {
    if (!profile) return;
    setLives(profile.lives);

    const interval = setInterval(() => {
      const now = new Date();
      const lastUpdate = new Date(profile.lastLifeUpdate);
        
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes >= 30 && profile.lives < 5) {
        const livesToAdd = Math.floor(diffMinutes / 30);
        const newLives = Math.min(5, profile.lives + livesToAdd);
        
        if (newLives !== profile.lives) {
          setLives(newLives);
          
          const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
          localData.lives = newLives;
          localData.lastLifeUpdate = Date.now();
          localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
          window.dispatchEvent(new Event('storage'));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [profile]);

  return lives;
};
