// Custom hook for chess game state management
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { Square, initializeBoard, resetBoardState } from '../utils/boardUtils';
import { 
  MoveData, 
  TimerState, 
  canSelectPiece, 
  canMovePiece, 
  executeBoardMove, 
  createMoveNotation 
} from '../utils/gameLogic';
import { 
  setupSocketListeners, 
  emitMove, 
  processSocketMove,
  SocketHandlers 
} from '../utils/socketUtils';

export const useChessGame = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<boolean>(false);
  const [playWhite, setPlayWhite] = useState<boolean>(true);
  const [board, setBoard] = useState<Square[]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [moveCounter, setMoveCounter] = useState<number>(1);
  const [timers, setTimers] = useState<TimerState>({
    white: 600,
    black: 600,
    currentPlayer: 'white'
  });
  const [moves, setMoves] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const newSocket = io('/chess');
    setSocket(newSocket);

    const handlers: SocketHandlers = {
      onGameStart: () => setGameState(true),
      onResetBoard: () => {
        const resetState = resetBoardState();
        setGameState(false);
        setBoard(resetState.board);
        setMoves(resetState.moves);
        setMoveCounter(resetState.moveCounter);
        setSelectedPiece(resetState.selectedPiece);
        setTimers(resetState.timers);
      },
      onSetTimer: (minutes: number) => {
        setGameState(false);
        setTimers({
          white: minutes * 60,
          black: minutes * 60,
          currentPlayer: 'white'
        });
      },
      onUserCountUpdate: (count: number) => setUserCount(count),
      onMoveReceived: (data: MoveData) => {
        processSocketMove(
          data, 
          board, 
          setBoard, 
          setMoves, 
          setMoveCounter, 
          setTimers
        );
      }
    };

    setupSocketListeners(newSocket, handlers);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePieceClick = (square: Square): void => {
    console.log('Square clicked:', square.id, 'Game state:', gameState, 'Piece:', square.piece?.type);

    if (!gameState) {
      console.log('Game not started yet');
      return;
    }

    if (selectedPiece) {
      console.log('Already have selected piece:', selectedPiece.id);

      // Check if clicked square has a piece that can be selected by current player
      if (square.piece && canSelectPiece(square, playWhite, moveCounter, gameState)) {
        // Player clicked on another of their own pieces - select it directly
        setSelectedPiece(square);
        console.log('Selected different own piece:', square.piece.type, 'at', square.id);
      } else if (canMovePiece(selectedPiece, square, playWhite, moveCounter, board)) {
        // Valid move attempt
        console.log('Valid move from', selectedPiece.id, 'to', square.id);
        executeMove(selectedPiece, square);
        setSelectedPiece(null);
      } else {
        // Invalid move or clicked on opponent piece, deselect
        console.log('Invalid move, deselecting piece');
        setSelectedPiece(null);
      }
    } else if (square.piece) {
      console.log('Turn check - Player plays white:', playWhite);

      // Check if piece can be selected
      if (canSelectPiece(square, playWhite, moveCounter, gameState)) {
        setSelectedPiece(square);
        console.log('Selected piece:', square.piece.type, 'at', square.id);
      }
    } else {
      console.log('Clicked empty square');
    }
  };

  const executeMove = (from: Square, to: Square): void => {
    const moveData: MoveData = {
      from: from.id,
      to: to.id,
      piece: from.piece!
    };

    const moveNotation = createMoveNotation(from, to);
    moveData.moveNotation = moveNotation;

    // Update board state
    setBoard(prevBoard => executeBoardMove(prevBoard, from, to));
    setMoves(prevMoves => [...prevMoves, moveNotation]);
    setMoveCounter(prev => prev + 1);
    setTimers(prev => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white'
    }));

    // Emit move to other players
    emitMove(socket, moveData);
  };

  const handleTimerUpdate = (color: 'white' | 'black', newTime: number): void => {
    setTimers(prev => ({
      ...prev,
      [color]: newTime
    }));
  };

  return {
    // State
    socket,
    gameState,
    playWhite,
    board,
    selectedPiece,
    moveCounter,
    timers,
    moves,
    userCount,
    
    // Actions
    setGameState,
    setPlayWhite,
    setBoard,
    setMoves,
    setMoveCounter,
    setSelectedPiece,
    setTimers,
    handlePieceClick,
    handleTimerUpdate
  };
};
