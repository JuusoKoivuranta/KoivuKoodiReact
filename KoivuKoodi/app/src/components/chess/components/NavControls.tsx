import React from 'react';
import { Socket } from 'socket.io-client';
import { 
  emitGameAction, 
  emitSetTimer 
} from '../utils/socketUtils';
import { TimerState } from '../utils/gameLogic';

interface NavControlsProps {
  socket: Socket | null;
  gameState: boolean;
  userCount: number;
  playWhite: boolean;
  onGameStateChange: (state: boolean) => void;
  onPlayWhiteChange: (playWhite: boolean) => void;
  onBoardReset: () => void;
  onTimerSet: (timers: TimerState) => void;
  onThemeToggle: () => void;
}

const NavControls: React.FC<NavControlsProps> = ({ 
  socket,
  gameState,
  userCount,
  playWhite,
  onGameStateChange,
  onPlayWhiteChange,
  onBoardReset,
  onTimerSet,
  onThemeToggle
}) => {
  const handlePlayWhite = () => {
    console.log('Play White clicked');
    if (!gameState) {
      onPlayWhiteChange(true);
      // Color change is purely local - no socket emission needed
    } else {
      console.log('Cannot change color during active game');
    }
  };

  const handlePlayBlack = () => {
    console.log('Play Black clicked');
    if (!gameState) {
      onPlayWhiteChange(false);
      // Color change is purely local - no socket emission needed
    } else {
      console.log('Cannot change color during active game');
    }
  };

  const handleStartGame = () => {
    console.log('Start Game clicked');
    if (!gameState) {
      onGameStateChange(true);
      emitGameAction(socket, 'start game');
    } else {
      console.log('Game is already started');
    }
  };

  const handleResetBoard = () => {
    console.log('Reset Board clicked');
    onBoardReset();
    emitGameAction(socket, 'reset board');
  };

  const handleSetTimeFormat = (minutes: number) => {
    console.log('Set Timer clicked:', minutes);
    if (!gameState) {
      const newTimers: TimerState = {
        white: minutes * 60,
        black: minutes * 60,
        currentPlayer: 'white'
      };
      onTimerSet(newTimers);
      emitSetTimer(socket, minutes);
    } else {
      console.log('Cannot change timer during active game');
    }
  };

  return (
    <div className="nav-controls">
      <h1>Click & Move Chess</h1>
      
      <section className="control-section user-count-section">
        <h2>Connected Users: {userCount}</h2>
      </section>
      
      <section className="control-section">
        <h2>Play Controls</h2>
        <div className="control-group">
          <button 
            onClick={handleStartGame} 
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
            onClick={handleResetBoard}
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
            onClick={handlePlayWhite} 
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
            onClick={handlePlayBlack} 
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
            onClick={() => handleSetTimeFormat(1)} 
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
            onClick={() => handleSetTimeFormat(5)} 
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
            onClick={() => handleSetTimeFormat(10)} 
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

      <section className="control-section theme-section">
        <button className="theme-toggle" onClick={onThemeToggle}>
          <img src={process.env.PUBLIC_URL + "/images/gameplay/cogwheel.png"} alt="Theme Settings" />
        </button>
      </section>
    </div>
  );
};

export default NavControls;
