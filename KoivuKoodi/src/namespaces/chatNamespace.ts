import { Server as SocketIOServer } from 'socket.io';
import { ChatMessage } from '../types';

let userCount: number = 0;

export const setupChatNamespace = (io: SocketIOServer): void => {
  const chatNamespace = io.of('/chat');
  
  chatNamespace.on('connection', (socket) => {
    console.log('New chat client connected');
    userCount++;
    chatNamespace.emit('update user number', userCount); // Updating current number of chatters

    // Handling chat message event
    socket.on('chat message', (msg: ChatMessage) => {
      chatNamespace.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Chat client disconnected');
      userCount--;
      chatNamespace.emit('update user number', userCount); // Updating current number of chatters
    });
  });
};
