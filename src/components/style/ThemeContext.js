import React, { createContext, useEffect, useState } from 'react';
import { lightTheme, darkTheme } from './themes';
import ThemeToggleButton from './ThemeToggleButton';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Verifica se há um tema salvo no armazenamento local e usa-o como tema inicial
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : lightTheme;

  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    // Salva o tema escolhido no armazenamento local
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  useEffect(() => {
    // Define a cor de fundo do documento com base no tema atual
    document.body.style.backgroundColor = theme.palette.primary.main;
  }, [theme]);

  return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ThemeToggleButton />
        {children}
      </ThemeContext.Provider>
  );
};

export default ThemeContext;
