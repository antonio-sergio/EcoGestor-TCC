import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
import { lightTheme } from './themes';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      {theme === lightTheme ? 'Modo Noturno' : 'Modo Claro'}
    </button>
  );
};

export default ThemeToggleButton;
