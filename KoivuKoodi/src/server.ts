// server/server.ts
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';

const app = express();

// SSL Configuration - only use in production with real certificates
let server: http.Server | https.Server;
let io: SocketIOServer;

const isProduction: boolean = process.env.NODE_ENV === 'production';
const port: number = parseInt(process.env.PORT || (isProduction ? '443' : '3000'));
const httpPort: number = parseInt(process.env.HTTP_PORT || '80');

interface SSLOptions {
  key: Buffer;
  cert: Buffer;
  secureProtocol: string;
  ciphers: string;
  honorCipherOrder: boolean;
}

if (isProduction && process.env.SSL_KEY && process.env.SSL_CERT) {
  // HTTPS server for production
  const sslOptions: SSLOptions = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    // Modern TLS configuration
    secureProtocol: 'TLSv1_2_method',
    ciphers: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-SHA256',
      'ECDHE-RSA-AES256-SHA384'
    ].join(':'),
    honorCipherOrder: true
  };
  
  server = https.createServer(sslOptions, app);
  
  // Create HTTP server for redirect
  const httpApp = express();
  httpApp.use((req: Request, res: Response) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
  const httpServer = http.createServer(httpApp);
  httpServer.listen(httpPort, () => {
    console.log(`HTTP redirect server running on port ${httpPort}`);
  });
} else {
  // HTTP server for development
  server = http.createServer(app);
}

io = new SocketIOServer(server);

let userCount: number = 0;

// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://firebasestorage.googleapis.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://firebasestorage.googleapis.com", "https://firebase.googleapis.com", "https://www.googleapis.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
} as any)); // Using 'as any' because permissionsPolicy is not in current helmet types

// Additional security middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Additional custom headers not covered by helmet
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Permissions Policy header (fallback if helmet doesn't set it)
  res.setHeader('Permissions-Policy', 
    'camera=(), ' +
    'microphone=(), ' +
    'geolocation=(), ' +
    'gyroscope=(), ' +
    'magnetometer=(), ' +
    'payment=(), ' +
    'usb=(), ' +
    'display-capture=(), ' +
    'fullscreen=(self), ' +
    'accelerometer=(), ' +
    'ambient-light-sensor=(), ' +
    'autoplay=(), ' +
    'bluetooth=(), ' +
    'cross-origin-isolated=()'
  );
  
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../app/build'), {
  setHeaders: (res: Response, filePath: string) => {
    // Set Cache-Control headers for .html files to no-cache
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Handle all GET requests and serve the React app
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../app/build', 'index.html'));
});

// Chat namespace
const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
    console.log('New chat client connected');
    userCount++;
    chatNamespace.emit('update user number', userCount); //Updating current number of chatters

    // Handling chat message event
    socket.on('chat message', (msg: string) => {
        chatNamespace.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Chat client disconnected');
        userCount--;
        chatNamespace.emit('update user number', userCount); //Updating current number of chatters
    });
});

// Chess namespace
let chessUserCount: number = 0;
const chessNamespace = io.of('/chess');

interface MoveData {
    from: string;
    to: string;
    piece?: string;
    [key: string]: any;
}

chessNamespace.on('connection', (socket) => {
    console.log('New chess client connected');
    chessUserCount++;
    chessNamespace.emit('update user number', chessUserCount); //Updating current number of chess players

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

    socket.on('set timer', (minutes: number) => { // Handling set timer event
        socket.broadcast.emit('set timer', minutes);
    });

    socket.on('move piece', (data: MoveData) => { // Handling click movement event
        socket.broadcast.emit('move piece', data);
    });

    socket.on('disconnect', () => {
        console.log('Chess client disconnected');
        chessUserCount--;
        chessNamespace.emit('update user number', chessUserCount); //Updating current number of chess players
    });
});

// Start the server
server.listen(port, () => {
  const protocol = isProduction && process.env.SSL_KEY ? 'https' : 'http';
  console.log(`Server is running on ${protocol}://localhost:${port}`);
  if (isProduction && process.env.SSL_KEY) {
    console.log('HTTPS enabled with modern TLS configuration');
  }
});
