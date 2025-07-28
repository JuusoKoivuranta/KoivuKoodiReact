import React from 'react';

const NavControls = ({ 
  onPlayWhite, 
  onPlayBlack, 
  onSettingsClick,
  onStartGame,
  onResetBoard,
  onSetTimeFormat,
  gameState 
}) => {
  return (
    <div className="nav-controls">
      <h1>Click & Move Chess</h1>
      
      <section className="control-section">
        <h2>Play Controls</h2>
        <div className="control-group">
          <button 
            onClick={onStartGame} 
            className="control-button"
            disabled={gameState}
            style={{ 
              opacity: gameState ? 0.5 : 1, 
              cursor: gameState ? 'not-allowed' : 'pointer' 
            }}
          >
            Start Game
          </button>
          <button 
            className="control-button"
            onClick={onResetBoard}
            hidden={!gameState}
          >
            Reset Board
          </button>
        </div>
      </section>

      <section className="control-section">
        <h2>Player Colors</h2>
        <div className="control-group">
          <button 
            onClick={onPlayWhite} 
            className="control-button"
            disabled={gameState}
            style={{ 
              opacity: gameState ? 0.5 : 1, 
              cursor: gameState ? 'not-allowed' : 'pointer' 
            }}
          >
            Play White
          </button>
          <button 
            onClick={onPlayBlack} 
            className="control-button"
            disabled={gameState}
            style={{ 
              opacity: gameState ? 0.5 : 1, 
              cursor: gameState ? 'not-allowed' : 'pointer' 
            }}
          >
            Play Black
          </button>
        </div>
      </section>

      <section className="control-section">
        <h2>Time Controls</h2>
        <div className="control-group">
          <button 
            onClick={() => onSetTimeFormat(1)} 
            className="control-button"
            disabled={gameState}
            style={{ 
              opacity: gameState ? 0.5 : 1, 
              cursor: gameState ? 'not-allowed' : 'pointer' 
            }}
          >
            1 Minute
          </button>
          <button 
            onClick={() => onSetTimeFormat(5)} 
            className="control-button"
            disabled={gameState}
            style={{ 
              opacity: gameState ? 0.5 : 1, 
              cursor: gameState ? 'not-allowed' : 'pointer' 
            }}
          >
            5 Minutes
          </button>
          <button 
            onClick={() => onSetTimeFormat(10)} 
            className="control-button"
            disabled={gameState}
            style={{ 
              opacity: gameState ? 0.5 : 1, 
              cursor: gameState ? 'not-allowed' : 'pointer' 
            }}
          >
            10 Minutes
          </button>
        </div>
      </section>

      <section className="control-section settings-section">
        <button className="settings" onClick={onSettingsClick}>
          <img src={process.env.PUBLIC_URL + "/images/gameplay/cogwheel.png"} alt="Settings" />
        </button>
      </section>
    </div>
  );
};

export default NavControls;
