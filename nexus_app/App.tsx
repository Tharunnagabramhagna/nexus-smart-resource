
import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Auth from './components/Auth';
import NEXUS from './NEXUS';
import { User } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial loading sequence
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return <Splash />;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <NEXUS 
        user={user} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />
    </div>
  );
};

export default App;
