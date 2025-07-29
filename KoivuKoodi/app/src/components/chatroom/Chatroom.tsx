import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import './Chatroom.css';

interface ChatMessage {
    nickname: string;
    message: string;
    color: string;
    timestamp?: string;
}

const Chatroom: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [nickname, setNickname] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<string>('#2695C9');

    useEffect(() => {
        // Connect to the '/chat' namespace
        const newSocket = io('/chat');
        setSocket(newSocket);

        // Listen for chat messages
        newSocket.on('chat message', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        // Listen for user count updates
        newSocket.on('update user number', (count) => {
            setUserCount(count);
        });

        // Cleanup on component unmount
        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!socket) {
            alert('Socket connection not established yet. Please wait a moment and try again.');
            return;
        }
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

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedColor(e.target.value);
    };

    return (
        <div className="chatroom">
            <h2>Current users in chat: {userCount}</h2>

            <button 
                className="colorPickerButton"
                onClick={() => (document.getElementById('colorPicker') as HTMLInputElement)?.click()}
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