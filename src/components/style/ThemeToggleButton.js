import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
import { lightTheme } from './themes';
import { LightMode, DarkMode } from '@mui/icons-material';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      {theme === lightTheme ? (
        <DarkMode style={{ fontSize: '16px' }} />
      ) : (
        <LightMode style={{ fontSize: '16px' }} />
      )}
    </button>
  );
};

export default ThemeToggleButton;
