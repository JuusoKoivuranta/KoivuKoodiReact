import React, { useState, useEffect } from 'react';
import './Chess.css';
import io from 'socket.io-client';
import ChessBoard from './components/ChessBoard';
import Timer from './components/Timer';
import Settings from './components/Settings';
import MoveHistory from './components/MoveHistory';
import NavControls from './components/NavControls';
import { isValidMove as validateMove } from './utils/moveValidation';

const Chess = () => {
  const [gameState, setGameState] = useState(false);
  const [playWhite, setPlayWhite] = useState(true);
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moveCounter, setMoveCounter] = useState(1);
  const [timers, setTimers] = useState({
    white: 600, // 10 minutes in seconds
    black: 600,
    currentPlayer: 'white'
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    const socket = io('/chess');
    
    socket.on('move piece', handleSocketMove);
    socket.on('playWhite', () => setPlayWhite(true));
    socket.on('playBlack', () => setPlayWhite(false));
    socket.on('start game', () => setGameState(true));

    return () => socket.disconnect();
  }, []);

  function initializeBoard() {
    const newBoard = [];
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const pieces = {
      1: ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'],
      2: Array(8).fill("Pawn"),
      7: Array(8).fill("Pawn"),
      8: ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
    };

    for (let i = 8; i > 0; i--) {
      for (let j = 0; j < 8; j++) {
        const square = {
          id: letters[j] + i,
          color: (i + j) % 2 === 0 ? 'white' : 'black',
          piece: null
        };

        if (pieces[i]) {
          const pieceColor = i <= 2 ? 'White' : 'Black';
          square.piece = {
            type: pieces[i][j],
            color: pieceColor,
            id: pieceColor + letters[j] + i,
            image: `/images/pieces/${pieceColor}${pieces[i][j]}.webp`
          };
        }

        newBoard.push(square);
      }
    }
    return newBoard;
  }

  const handlePieceClick = (square) => {
    if (!gameState) return;

    if (selectedPiece) {
      // Handle move
      if (isValidMove(selectedPiece, square)) {
        movePiece(selectedPiece, square);
        setSelectedPiece(null);
      } else {
        setSelectedPiece(null);
      }
    } else if (square.piece && 
              ((moveCounter % 2 === 1 && square.piece.color === 'White') || 
               (moveCounter % 2 === 0 && square.piece.color === 'Black'))) {
      setSelectedPiece(square);
    }
  };

  const isValidMove = (from, to) => {
    return validateMove(from, to, board);
  };

  const movePiece = (from, to) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const fromIndex = newBoard.findIndex(s => s.id === from.id);
      const toIndex = newBoard.findIndex(s => s.id === to.id);
      
      if (newBoard[toIndex].piece) {
        // Handle capture
      }
      
      newBoard[toIndex].piece = newBoard[fromIndex].piece;
      newBoard[fromIndex].piece = null;
      
      return newBoard;
    });
    
    setMoveCounter(prev => prev + 1);
    switchTimer();
  };

  const switchTimer = () => {
    setTimers(prev => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white'
    }));
  };

  const handleSocketMove = (data) => {
    // Handle socket moves here
  };

  return (
    <div className="chess-container">
      <NavControls
        gameState={gameState}
        onPlayWhite={() => setPlayWhite(true)}
        onPlayBlack={() => setPlayWhite(false)}
        onSettingsClick={() => setIsSettingsOpen(!isSettingsOpen)}
        onStartGame={() => setGameState(true)}
        onResetBoard={() => {
          setBoard(initializeBoard());
          setMoves([]);
          setMoveCounter(1);
        }}
        onSetTimeFormat={(minutes) => {
          setTimers({
            white: minutes * 60,
            black: minutes * 60,
            currentPlayer: 'white'
          });
        }}
      />

      <div className="game-area">
        <Timer
          className="timerB"
          time={timers.black}
          isActive={timers.currentPlayer === 'black' && gameState}
        />
        
        <ChessBoard
          board={board}
          selectedPiece={selectedPiece}
          onSquareClick={handlePieceClick}
          playWhite={playWhite}
        />
        
        <Timer
          className="timerW"
          time={timers.white}
          isActive={timers.currentPlayer === 'white' && gameState}
        />

        <MoveHistory moves={moves} />
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onThemeChange={(theme) => {
          document.documentElement.style.setProperty('--primary-color', theme[0]);
          // Add more theme changes here
        }}
      />
    </div>
  );
};

export default Chess;