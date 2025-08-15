// Component that handles the game area layout with timers and board
import React from 'react';
import ChessBoard from './ChessBoard';
import Timer from './Timer';
import { Square } from '../utils/boardUtils';
import { TimerState } from '../utils/gameLogic';

interface ChessGameAreaProps {
  board: Square[];
  selectedPiece: Square | null;
  timers: TimerState;
  gameState: boolean;
  playWhite: boolean;
  onSquareClick: (square: Square) => void;
  onTimerUpdate: (color: 'white' | 'black', newTime: number) => void;
}

const ChessGameArea: React.FC<ChessGameAreaProps> = ({
  board,
  selectedPiece,
  timers,
  gameState,
  playWhite,
  onSquareClick,
  onTimerUpdate
}) => {
  return (
    <div className="game-area">
      {playWhite ? (
        // When playing white: Black timer on top, White timer on bottom
        <>
          <Timer
            className="timerB"
            time={timers.black}
            isActive={timers.currentPlayer === 'black' && gameState}
            onTimeUpdate={(newTime) => onTimerUpdate('black', newTime)}
          />
          
          <ChessBoard
            board={board}
            selectedPiece={selectedPiece}
            onSquareClick={onSquareClick}
            playWhite={playWhite}
          />
          
          <Timer
            className="timerW"
            time={timers.white}
            isActive={timers.currentPlayer === 'white' && gameState}
            onTimeUpdate={(newTime) => onTimerUpdate('white', newTime)}
          />
        </>
      ) : (
        // When playing black: White timer on top, Black timer on bottom
        <>
          <Timer
            className="timerW"
            time={timers.white}
            isActive={timers.currentPlayer === 'white' && gameState}
            onTimeUpdate={(newTime) => onTimerUpdate('white', newTime)}
          />
          
          <ChessBoard
            board={board}
            selectedPiece={selectedPiece}
            onSquareClick={onSquareClick}
            playWhite={playWhite}
          />
          
          <Timer
            className="timerB"
            time={timers.black}
            isActive={timers.currentPlayer === 'black' && gameState}
            onTimeUpdate={(newTime) => onTimerUpdate('black', newTime)}
          />
        </>
      )}
    </div>
  );
};

export default ChessGameArea;
