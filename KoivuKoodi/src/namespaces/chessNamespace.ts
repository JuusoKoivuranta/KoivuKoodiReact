import { Server as SocketIOServer } from 'socket.io';
import { MoveData } from '../types/serverTypes';

let chessUserCount: number = 0;

export const setupChessNamespace = (io: SocketIOServer): void => {
  const chessNamespace = io.of('/chess');
  
  chessNamespace.on('connection', (socket) => {
    console.log('New chess client connected');
    chessUserCount++;
    chessNamespace.emit('update user number', chessUserCount); // Updating current number of chess players

    socket.on('playWhite', () => { 
      // Player chooses to play white - no need to broadcast to others
      // Each player manages their own color choice locally
      console.log('Player chose to play white');
    });

    socket.on('playBlack', () => { 
      // Player chooses to play black - no need to broadcast to others  
      // Each player manages their own color choice locally
      console.log('Player chose to play black');
    });

    socket.on('start game', () => { // Handling start game event
      socket.broadcast.emit('start game');
    });

    socket.on('reset board', () => { // Handling reset board event
      socket.broadcast.emit('reset board');
    });

    socket.on('set timer', (minutes: number) => { // Handling set timer event
      socket.broadcast.emit('set timer', minutes);
    });

    socket.on('move piece', (data: MoveData) => { // Handling click movement event
      socket.broadcast.emit('move piece', data);
    });

    socket.on('disconnect', () => {
      console.log('Chess client disconnected');
      chessUserCount--;
      chessNamespace.emit('update user number', chessUserCount); // Updating current number of chess players
    });
  });
};
