// src/hooks/ThemeSwitcher.js
import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeSwitcher = () => {
    const { isDarkTheme, toggleTheme } = useTheme();

    // Conditional styles based on the theme
    const themeStyles = {
        backgroundColor: isDarkTheme ? '#000' : '#FFF',
        color: isDarkTheme ? '#FFF' : '#000',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '5vh',
        textAlign: 'center',
        transition: 'all 0.3s ease', // Smooth transition effect
        border: isDarkTheme ? '0.5vh solid white' : '0.5vh solid black', // Solid black border
    };

    return (
        <div style={themeStyles}>
            <h1>Theme Context Example</h1>
            <h1>Current Theme: {isDarkTheme ? 'Dark' : 'Light'}</h1>
            <button onClick={toggleTheme}>
                Switch to {isDarkTheme ? 'Light' : 'Dark'} Theme
            </button>
        </div>
    );
};

export default ThemeSwitcher;
