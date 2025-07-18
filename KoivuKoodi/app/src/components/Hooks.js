// src/components/Hooks.js
import React from 'react';
import Counter from './hooks/Counter';
import { ThemeProvider } from './hooks/ThemeContext';
import ThemeSwitcher from './hooks/ThemeSwitcher';
import './Hooks.css';

const Hooks = () => {
  return (
    <div>
      <Counter />

      <div>
      <ThemeProvider>
        <div style={{ textAlign: 'center' }} className='Themes'>
          <ThemeSwitcher />
        </div>
      </ThemeProvider>
      </div>

    </div>
  );
};

export default Hooks;
