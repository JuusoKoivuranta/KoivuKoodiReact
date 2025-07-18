import React from 'react';

const GameControls = ({ 
  gameState, 
  onStartGame, 
  onResetBoard, 
  onSetTimeFormat 
}) => {
  return (
    <div className="game-controls">
      <button onClick={onStartGame} className="startGame">
        Start Game
      </button>
      <button className="resetBoard" hidden={!gameState} onClick={onResetBoard}>
        Reset Board
      </button>
      <button className="oneMinutes" onClick={() => onSetTimeFormat(1)}>
        1<br/>minute
      </button>
      <button className="fiveMinutes" onClick={() => onSetTimeFormat(5)}>
        5<br/>minutes
      </button>
      <button className="tenMinutes" onClick={() => onSetTimeFormat(10)}>
        10<br/>minutes
      </button>
    </div>
  );
};

export default GameControls;
