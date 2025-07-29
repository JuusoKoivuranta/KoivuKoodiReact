import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className='home-page-container'>
      <div className='main'>
        <h1>KoivuKoodi</h1>
        <p>Project Library Made by Juuso Koivuranta</p>
        
        <div className='grid-container'>
          <Link to="/gallery" className='grid-item'>
            <div className='item-content'>Gallery</div>
          </Link>
          <Link to="/chess" className='grid-item'>
            <div className='item-content'>Chess</div>
          </Link>
          <Link to="/chatroom" className='grid-item'>
            <div className='item-content'>Chatroom</div>
          </Link>
          <Link to="/minesweeper" className='grid-item'>
            <div className='item-content'>Minesweeper</div>
          </Link>
          <Link to="/about" className='grid-item'>
            <div className='item-content'>About</div>
          </Link>
          <Link to="/coming-soon" className='grid-item'>
            <div className='item-content'>Coming Soon</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
