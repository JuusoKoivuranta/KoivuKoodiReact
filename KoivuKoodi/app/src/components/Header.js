import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <h1 className='head-text'>KoivuKoodi ReactJS Test Page</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/gallery">Photo Gallery Test</Link></li>
          <li><Link to="/hooks">Hook Testing</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><a href="https://www.koivukoodi.com" target="_blank" rel="noopener noreferrer">KoivuKoodi Home Page</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
