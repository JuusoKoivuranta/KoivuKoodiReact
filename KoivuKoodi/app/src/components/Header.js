import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <h1 className='head-text'>KoivuKoodi</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/gallery">Photo Gallery</Link></li>
          <li><Link to="/chess">Chess</Link></li>
          <li><Link to="/chatroom">Chat Room</Link></li>
          <li><Link to="/minesweeper">Minesweeper</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
