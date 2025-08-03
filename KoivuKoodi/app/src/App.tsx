import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/front-pages/Home';
import Gallery from './components//gallery/Gallery';
import Chess from './components/chess/Chess';
import Chatroom from './components/chatroom/Chatroom';
import Minesweeper from './components/minesweeper/Minesweeper';
import About from './components/front-pages/About';

const App: React.FC = () => {

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <>
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/chess" element={<Chess />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/minesweeper" element={<Minesweeper />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
