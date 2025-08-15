// Socket.IO related utilities and handlers
import { Socket } from 'socket.io-client';
import { Square } from './boardUtils';
import { MoveData, TimerState } from './gameLogic';

export interface SocketHandlers {
  onGameStart: () => void;
  onResetBoard: () => void;
  onSetTimer: (minutes: number) => void;
  onUserCountUpdate: (count: number) => void;
  onMoveReceived: (data: MoveData) => void;
}

export const setupSocketListeners = (socket: Socket, handlers: SocketHandlers): void => {
  socket.on('connect', () => {
    console.log('Connected to chess namespace');
  });

  socket.on('start game', () => {
    console.log('Received start game event');
    handlers.onGameStart();
  });

  socket.on('reset board', () => {
    console.log('Received reset board event');
    handlers.onResetBoard();
  });

  socket.on('set timer', (minutes: number) => {
    console.log('Received set timer event:', minutes);
    handlers.onSetTimer(minutes);
  });

  // Removed playWhite and playBlack socket listeners
  // Each player now manages their color choice locally

  socket.on('update user number', (count: number) => {
    console.log('Received chess user count update:', count);
    handlers.onUserCountUpdate(count);
  });

  socket.on('move piece', (data: MoveData) => {
    handlers.onMoveReceived(data);
  });
};

export const emitGameAction = (
  socket: Socket | null,
  action: 'start game' | 'reset board',
  data?: any
): void => {
  if (socket) {
    console.log(`Emitting ${action} event`, data || '');
    socket.emit(action, data);
  }
};

export const emitSetTimer = (socket: Socket | null, minutes: number): void => {
  if (socket) {
    console.log('Emitting set timer event:', minutes);
    socket.emit('set timer', minutes);
  }
};

export const emitMove = (socket: Socket | null, moveData: MoveData): void => {
  if (socket) {
    socket.emit('move piece', moveData);
  }
};

export const processSocketMove = (
  data: MoveData,
  board: Square[],
  setBoard: React.Dispatch<React.SetStateAction<Square[]>>,
  setMoves: React.Dispatch<React.SetStateAction<string[]>>,
  setMoveCounter: React.Dispatch<React.SetStateAction<number>>,
  setTimers: React.Dispatch<React.SetStateAction<TimerState>>
): void => {
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

  setTimers(prev => ({
    ...prev,
    currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white'
  }));
};
