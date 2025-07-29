import React from 'react';

interface ThemePanelProps {
  isOpen: boolean;
  onThemeChange: (theme: string[]) => void;
  onClose: () => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ isOpen, onThemeChange, onClose }) => {
  const themes = {
    main: ['#739072', '#4F6F52', '#3A4D39', '#ECE3CE', '#ECE3CE', '#3A4D39', '#333', '#ECE3CE', '#333', '#3A4D39', '#ECE3CE'],
    original: ['lightgreen', 'goldenrod', '#0056b3', '#ffee00', 'burlywood', '#c48f49', '#333', '#ffee00', '#333', '#0056b3', 'white'],
    dark: ['#2E4F4F', '#0E8388', '#2C3333', '#CBE4DE', '#CBE4DE', '#2C3333', '#333', '#CBE4DE', '#333', '#2C3333', '#CBE4DE'],
    light: ['#D8EFD3', '#95D2B3', '#55AD9B', '#F1F8E8', '#F1F8E8', '#55AD9B', '#333', '#F1F8E8', '#333', '#55AD9B', 'white'],
    chess: ['#302e2b', '#262522', '#21201d', '#3c3b39', '#ebecd0', '#739552', 'white', '#ebecd0', 'black', '#21201d', '#3c3b39']
  };

  if (!isOpen) return null;

  return (
    <div id="theme-panel" className="theme-panel">
      <div className="theme-panel-header">
        <h2>Theme Settings</h2>
        <button className="theme-close-button" onClick={onClose}>
          X
        </button>
      </div>
      <button className="theme-main" onClick={() => onThemeChange(themes.main)}>
        Main Theme
      </button>
      <button className="theme-dark" onClick={() => onThemeChange(themes.dark)}>
        Dark Theme
      </button>
      <button className="theme-light" onClick={() => onThemeChange(themes.light)}>
        Light Theme
      </button>
      <button className="theme-chess" onClick={() => onThemeChange(themes.chess)}>
        Chess.com Theme
      </button>
      <button className="theme-original" onClick={() => onThemeChange(themes.original)}>
        Original Theme
      </button>
    </div>
  );
};

export default ThemePanel;
