import React from 'react';
import { Button } from 'react-bootstrap';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-secondary"
      onClick={toggleTheme}
      className="rounded-circle d-flex align-items-center justify-content-center p-2 border-0"
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        color: theme === 'dark' ? '#fcd34d' : '#475569',
      }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? <BsSunFill size={18} /> : <BsMoonStarsFill size={17} />}
    </Button>
  );
};
