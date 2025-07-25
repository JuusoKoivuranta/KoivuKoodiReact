import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chatroom.css';

function Chatroom() {
    const [socket, setSocket] = useState(null);
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [selectedColor, setSelectedColor] = useState('#2695C9');

    const sendMessage = (e) => {
        e.preventDefault();
        if (nickname.trim() === '' || message.trim() === '') {
            alert('Please enter both a nickname and a message.');
            return;
        }

        socket.emit('chat message', {
            nickname: nickname,
            message: message,
            color: selectedColor
        });
        setMessage('');
    };

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };

    return (
        <div className="chatroom">
            <h2>Current users in chat: {userCount}</h2>

            <button 
                className="colorPickerButton"
                onClick={() => document.getElementById('colorPicker').click()}
            >
                Change Message Background Color
            </button>
            <input
                type="color"
                id="colorPicker"
                style={{ display: 'none' }}
                onChange={handleColorChange}
                value={selectedColor}
            />

            <ul>
                {messages.map((msg, index) => (
                    <li key={index} style={{ backgroundColor: msg.color }}>
                        {msg.nickname}: {msg.message}
                    </li>
                ))}
            </ul>

            <form className="inputContainer" onSubmit={sendMessage}>
                <input
                    className="nicknameInput"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Your nickname"
                />
                <input
                    className="messageInput"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chatroom;