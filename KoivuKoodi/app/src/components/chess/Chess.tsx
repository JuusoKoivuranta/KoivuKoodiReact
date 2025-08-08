import React, { useState, useEffect } from 'react';
import './Chess.css';
import io, { Socket } from 'socket.io-client';
import ChessBoard from './components/ChessBoard';
import Timer from './components/Timer';
import ThemePanel from './components/ThemePanel';
import MoveHistory from './components/MoveHistory';
import NavControls from './components/NavControls';

interface ChessPiece {
  type: string;
  color: string;
  image: string;
}

interface Square {
  id: string;
  color: string;
  piece?: ChessPiece;
}

interface TimerState {
  white: number;
  black: number;
  currentPlayer: 'white' | 'black';
}

interface MoveData {
  from: string;
  to: string;
  piece: ChessPiece;
  moveNotation?: string;
}

const Chess: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<boolean>(false);
  const [playWhite, setPlayWhite] = useState<boolean>(true);
  const [board, setBoard] = useState<Square[]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [moveCounter, setMoveCounter] = useState<number>(1);
  const [timers, setTimers] = useState<TimerState>({
    white: 600, // 10 minutes in seconds
    black: 600,
    currentPlayer: 'white'
  });
  const [isThemePanelOpen, setIsThemePanelOpen] = useState<boolean>(false);
  const [moves, setMoves] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const newSocket = io('/chess');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Connected to chess namespace');
    });
    
    newSocket.on('move piece', handleSocketMove);
    
    newSocket.on('playWhite', () => {
      console.log('Received playWhite event');
      setPlayWhite(true);
    });
    
    newSocket.on('playBlack', () => {
      console.log('Received playBlack event');
      setPlayWhite(false);
    });
    
    newSocket.on('start game', () => {
      console.log('Received start game event');
      setGameState(true);
    });
    
    newSocket.on('reset board', () => {
      console.log('Received reset board event');
      setGameState(false); // Stop the game
      setBoard(initializeBoard());
      setMoves([]);
      setMoveCounter(1);
      setSelectedPiece(null);
      setTimers({
        white: 600,
        black: 600,
        currentPlayer: 'white'
      });
    });
    
    newSocket.on('set timer', (minutes: number) => {
      console.log('Received set timer event:', minutes);
      setGameState(false); // Stop the game when timer is changed
      setTimers({
        white: minutes * 60,
        black: minutes * 60,
        currentPlayer: 'white'
      });
    });

    // Listen for user count updates
    newSocket.on('update user number', (count: number) => {
      console.log('Received chess user count update:', count);
      setUserCount(count);
    });

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initializeBoard(): Square[] {
    const newBoard: Square[] = [];
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const pieces: { [key: number]: string[] } = {
      1: ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'],
      2: Array(8).fill("Pawn"),
      7: Array(8).fill("Pawn"),
      8: ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
    };

    for (let i = 8; i > 0; i--) {
      for (let j = 0; j < 8; j++) {
        const square: Square = {
          id: letters[j] + i,
          color: (i + j) % 2 === 0 ? 'white' : 'black'
        };

        if (pieces[i]) {
          const pieceColor = i <= 2 ? 'White' : 'Black';
          square.piece = {
            type: pieces[i][j],
            color: pieceColor,
            image: `/images/pieces/${pieceColor}${pieces[i][j]}.webp`
          };
        }

        newBoard.push(square);
      }
    }
    return newBoard;
  }

  const handlePieceClick = (square: Square): void => {
    console.log('Square clicked:', square.id, 'Game state:', gameState, 'Piece:', square.piece?.type);
    
    if (!gameState) {
      console.log('Game not started yet');
      return;
    }

    if (selectedPiece) {
      console.log('Already have selected piece:', selectedPiece.id);
      // Handle move
      if (isValidMove(selectedPiece, square)) {
        console.log('Valid move from', selectedPiece.id, 'to', square.id);
        movePiece(selectedPiece, square);
        setSelectedPiece(null);
      } else {
        console.log('Invalid move, deselecting piece');
        setSelectedPiece(null);
      }
    } else if (square.piece) {
      // Check if it's the correct player's turn
      const isWhiteTurn = moveCounter % 2 === 1;
      const isPieceWhite = square.piece.color === 'White';
      
      console.log('Turn check - White turn:', isWhiteTurn, 'Piece is white:', isPieceWhite);
      
      // Allow piece selection if it matches the current turn
      if ((isWhiteTurn && isPieceWhite) || (!isWhiteTurn && !isPieceWhite)) {
        setSelectedPiece(square);
        console.log('Selected piece:', square.piece.type, 'at', square.id);
      } else {
        console.log('Not the right turn for this piece');
      }
    } else {
      console.log('Clicked empty square');
    }
  };

  const isValidMove = (from: Square, to: Square): boolean => {
    if (!from.piece) return false;
    // For now, allow any move except moving to a square with same color piece
    if (to.piece && to.piece.color === from.piece.color) {
      return false;
    }
    return true; // Temporarily allow all valid moves for testing
  };

  const movePiece = (from: Square, to: Square): void => {
    const moveData: MoveData = {
      from: from.id,
      to: to.id,
      piece: from.piece!
    };

    // Create move notation for history
    const moveNotation = `${from.piece!.type}${from.id}-${to.id}`;

    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const fromIndex = newBoard.findIndex(s => s.id === from.id);
      const toIndex = newBoard.findIndex(s => s.id === to.id);
      
      if (newBoard[toIndex].piece) {
        // Handle capture
      }
      
      newBoard[toIndex].piece = newBoard[fromIndex].piece;
      delete newBoard[fromIndex].piece;
      
      return newBoard;
    });
    
    setMoves(prevMoves => [...prevMoves, moveNotation]);
    setMoveCounter(prev => prev + 1);
    switchTimer();

    // Emit move to other players
    if (socket) {
      socket.emit('move piece', { ...moveData, moveNotation });
    }
  };

  const switchTimer = () => {
    setTimers(prev => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white'
    }));
  };

  const handleTimerUpdate = (color: 'white' | 'black', newTime: number): void => {
    setTimers(prev => ({
      ...prev,
      [color]: newTime
    }));
  };

  const handleSocketMove = (data: MoveData): void => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const fromIndex = newBoard.findIndex(s => s.id === data.from);
      const toIndex = newBoard.findIndex(s => s.id === data.to);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        if (newBoard[toIndex].piece) {
          // Handle capture
        }
        
        newBoard[toIndex].piece = newBoard[fromIndex].piece;
        delete newBoard[fromIndex].piece;
      }
      
      return newBoard;
    });
    
    if (data.moveNotation) {
      setMoves(prevMoves => [...prevMoves, data.moveNotation!]);
    }
    setMoveCounter(prev => prev + 1);
    switchTimer();
  };

  return (
    <div className="chess-container">
      <NavControls
        gameState={gameState}
        userCount={userCount}
        onPlayWhite={() => {
          console.log('Play White clicked');
          if (!gameState) {
            setPlayWhite(true);
          } else {
            console.log('Cannot change color during active game');
          }
        }}
        onPlayBlack={() => {
          console.log('Play Black clicked');
          if (!gameState) {
            setPlayWhite(false);
          } else {
            console.log('Cannot change color during active game');
          }
        }}
        onThemeToggle={() => setIsThemePanelOpen(!isThemePanelOpen)}
        onStartGame={() => {
          console.log('Start Game clicked');
          if (!gameState) {
            setGameState(true);
            if (socket) {
              console.log('Emitting start game event');
              socket.emit('start game');
            }
          } else {
            console.log('Game is already started');
          }
        }}
        onResetBoard={() => {
          console.log('Reset Board clicked');
          setGameState(false); // Stop the game
          setBoard(initializeBoard());
          setMoves([]);
          setMoveCounter(1);
          setSelectedPiece(null);
          setTimers({
            white: 600,
            black: 600,
            currentPlayer: 'white'
          });
          if (socket) {
            console.log('Emitting reset board event');
            socket.emit('reset board');
          }
        }}
        onSetTimeFormat={(minutes) => {
          console.log('Set Timer clicked:', minutes);
          if (!gameState) {
            setGameState(false); // Stop the game when changing timer
            setTimers({
              white: minutes * 60,
              black: minutes * 60,
              currentPlayer: 'white'
            });
            if (socket) {
              console.log('Emitting set timer event:', minutes);
              socket.emit('set timer', minutes);
            }
          } else {
            console.log('Cannot change timer during active game');
          }
        }}
      />

      <div className="game-area">
        {playWhite ? (
          // When playing white: Black timer on top, White timer on bottom
          <>
            <Timer
              className="timerB"
              time={timers.black}
              isActive={timers.currentPlayer === 'black' && gameState}
              onTimeUpdate={(newTime) => handleTimerUpdate('black', newTime)}
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
              onTimeUpdate={(newTime) => handleTimerUpdate('white', newTime)}
            />
          </>
        ) : (
          // When playing black: White timer on top, Black timer on bottom
          <>
            <Timer
              className="timerW"
              time={timers.white}
              isActive={timers.currentPlayer === 'white' && gameState}
              onTimeUpdate={(newTime) => handleTimerUpdate('white', newTime)}
            />
            
            <ChessBoard
              board={board}
              selectedPiece={selectedPiece}
              onSquareClick={handlePieceClick}
              playWhite={playWhite}
            />
            
            <Timer
              className="timerB"
              time={timers.black}
              isActive={timers.currentPlayer === 'black' && gameState}
              onTimeUpdate={(newTime) => handleTimerUpdate('black', newTime)}
            />
          </>
        )}
      </div>

      <div className="right-panel">
        <MoveHistory moves={moves} />
      </div>

      <ThemePanel
        isOpen={isThemePanelOpen}
        onClose={() => setIsThemePanelOpen(false)}
        onThemeChange={(theme) => {
          // Apply theme colors to CSS custom properties
          const root = document.documentElement;
          root.style.setProperty('--primary-color', theme[0]);
          root.style.setProperty('--secondary-color', theme[1]);
          root.style.setProperty('--nav-background', theme[2]);
          root.style.setProperty('--button-background', theme[3]);
          root.style.setProperty('--white-square', theme[4]);
          root.style.setProperty('--black-square', theme[5]);
          root.style.setProperty('--text-color', theme[6] || '#333');
          root.style.setProperty('--timer-white-bg', theme[7] || '#ECE3CE');
          root.style.setProperty('--timer-white-text', theme[8] || '#333');
          root.style.setProperty('--timer-black-bg', theme[9] || '#3A4D39');
          root.style.setProperty('--timer-black-text', theme[10] || '#ECE3CE');
          
          console.log('Theme changed to:', theme);
        }}
      />
    </div>
  );
};

export default Chess;