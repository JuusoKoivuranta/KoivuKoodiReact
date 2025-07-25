import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className='about-page-container'>
            <div className='about-main'>
                <h1>About Page</h1>
                <p>A hobby project for learning how to use and program ReactJS :)</p>
                <p>GitHub Copilot Pro was used in this project.</p>
                <p>Made by Juuso Koivuranta.</p>
                
                <a href="https://github.com/JuusoKoivuranta/KoivuKoodiReact" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="github-link">
                    <FaGithub className="github-logo" />
                    <span className="github-text">View on GitHub</span>
                </a>
            </div>
        </div>
    );
};

export default About;