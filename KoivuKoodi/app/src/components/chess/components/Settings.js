import React from 'react';

const Settings = ({ isOpen, onThemeChange }) => {
  const themes = {
    main: ['#739072', '#4F6F52', '#3A4D39', '#ECE3CE', '#ECE3CE', '#3A4D39', 'black'],
    original: ['lightgreen', 'goldenrod', '#0056b3', '#ffee00', 'burlywood', '#c48f49'],
    dark: ['#2E4F4F', '#0E8388', '#2C3333', '#CBE4DE', '#CBE4DE', '#2C3333'],
    light: ['#D8EFD3', '#95D2B3', '#55AD9B', '#F1F8E8', '#F1F8E8', '#55AD9B', 'black'],
    chess: ['#302e2b', '#262522', '#21201d', '#3c3b39', '#ebecd0', '#739552', 'white']
  };

  if (!isOpen) return null;

  return (
    <div id="sidebar" className="sidebar">
      <h2>Change Theme</h2>
      <button className="mainTheme" onClick={() => onThemeChange(themes.main)}>
        Main Theme
      </button>
      <button className="darkTheme" onClick={() => onThemeChange(themes.dark)}>
        Dark Theme
      </button>
      <button className="lightTheme" onClick={() => onThemeChange(themes.light)}>
        Light Theme
      </button>
      <button className="chessTheme" onClick={() => onThemeChange(themes.chess)}>
        Chess.com Theme
      </button>
      <button className="originalTheme" onClick={() => onThemeChange(themes.original)}>
        Original Theme
      </button>
    </div>
  );
};

export default Settings;
