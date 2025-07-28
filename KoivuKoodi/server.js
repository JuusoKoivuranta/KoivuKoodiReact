// server/server.js
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

let userCount = 0;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './app/build'), {
  setHeaders: (res, filePath) => {
    // Set Cache-Control headers for .html files to no-cache
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Handle all GET requests and serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './app/build', 'index.html'));
});

// Chat namespace
const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
    console.log('New chat client connected');
    userCount++;
    chatNamespace.emit('update user number', userCount); //Updating current number of chatters

    // Handling chat message event
    socket.on('chat message', (msg) => {
        chatNamespace.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Chat client disconnected');
        userCount--;
        chatNamespace.emit('update user number', userCount); //Updating current number of chatters
    });
});

// Chess namespace
const chessNamespace = io.of('/chess');
chessNamespace.on('connection', (socket) => {
    console.log('New chess client connected');

    socket.on('playWhite', () => { // Informs the other side of player change
        socket.broadcast.emit('playWhite');
    });

    socket.on('playBlack', () => { // Informs the other side of player change
        socket.broadcast.emit('playBlack');
    });

    socket.on('start game', () => { // Handling start game event
        socket.broadcast.emit('start game');
    });

    socket.on('reset board', () => { // Handling reset board event
        socket.broadcast.emit('reset board');
    });

    socket.on('set timer', (minutes) => { // Handling set timer event
        socket.broadcast.emit('set timer', minutes);
    });

    socket.on('move piece', (data) => { // Handling click movement event
        socket.broadcast.emit('move piece', data);
    });

    socket.on('disconnect', () => {
        console.log('Chess client disconnected');
    });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
