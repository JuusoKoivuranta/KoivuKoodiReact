# KoivuKoodiReact

A hobby web application featuring interactive games and real-time communication built with React and Express.

## 🎮 Projects

- **Real-time Chess** - Play chess with live synchronization, timers, and theme customization
- **Chat Room** - Multi-user chat with custom message colors and live user count
- **Minesweeper** - Classic minesweeper game
- **Photo Gallery** - Firebase-powered image gallery

## 🏗️ Architecture

**Dual-structure monorepo:**
- `KoivuKoodi/` - Express.js server with Socket.IO
- `KoivuKoodi/app/` - React frontend application

**Real-time Communication:**
- Socket.IO with separate namespaces
- Live user counting and game state synchronization

**Deployment:**
- Google Cloud App Engine with automatic scaling
- HTTPS with modern TLS configuration
- Firebase Storage for image assets

## ️ Technology Stack

### Frontend (React App)
| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^18.3.1 | Core React library |
| **react-dom** | ^18.3.1 | React DOM rendering |
| **react-router-dom** | ^6.25.1 | Client-side routing |
| **react-scripts** | 5.0.1 | Create React App build tools |
| **typescript** | ^5.8.3 | Type safety and development experience |
| **socket.io-client** | ^4.8.1 | Real-time communication with server |
| **firebase** | ^12.0.0 | Firebase Storage for image assets |
| **react-icons** | ^5.5.0 | Icon components |
| **axios** | ^1.7.3 | HTTP client for API requests |

### Backend (Express Server)
| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^4.19.2 | Web server framework |
| **socket.io** | ^4.8.1 | Real-time bidirectional communication |
| **helmet** | ^8.1.0 | Security headers and protection |


## 🎯 Projects in-depth

### Chess Game
- Real-time multiplayer synchronization
- Chess timer with customizable duration
- Multiple visual themes (Original, Dark, Light, Chess.com style)
- Move history tracking
- Player role selection (White/Black)

### Chat Room
- Live user count display
- Custom message background colors
- Real-time message broadcasting
- Nickname support

### Photo Gallery
- Firebase Storage integration for image hosting
- Responsive grid layout for photo display
- Optimized image loading and caching
- Seamless cloud-based asset management

### Minesweeper
- Classic minesweeper gameplay mechanics
- Interactive grid with mine detection
- Flag system for marking suspected mines
- Game state management (win/lose conditions)

## 🔒 Security Features

- **Helmet.js** - Security headers and CSP
- **HTTPS in production** - Modern TLS configuration
- **Environment variable protection** - Sensitive data excluded from repository
- **Firebase security rules** - Controlled access to storage

## 🌐 Deployment

Deployed on **Google Cloud App Engine** with:
- Automatic scaling (1-10 instances)
- Node.js 20 runtime
- Static file serving with caching
- HTTPS termination at load balancer

## 📝 Development Notes

**Started:** June 2024  
**Developer:** Juuso Koivuranta  
**AI Assistance:** GitHub Copilot Pro was used throughout development  
**Purpose:** Learning modern web development, real-time applications, and cloud deployment
