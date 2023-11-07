import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Message = ({ message }) => {
    if (message.type === 'join') return <p>{`${message.sid} just joined`}</p>;
    if (message.type === 'chat') return <p>{`${message.sid}: ${message.message}`}</p>;
};

// const socket = io(process.env.REACT_APP_API_URL, {
//     path: process.env.REACT_APP_SOCKET_PATH,
// });

const socket = io(
    'http://localhost:8000',
    {path: '/ws/sockets'}
    )

export const Chat = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(socket.connected);
        });

        socket.on('disconnect', () => {
            setIsConnected(socket.connected);
        });

        socket.on('join', (data) => {
            setMessages((prevMessages) => [...prevMessages, { ...data, type: 'join' }]);
        });

        socket.on('chat', (data) => {
            setMessages((prevMessages) => [...prevMessages, { ...data, type: 'chat' }]);
        });
    }, []);

    return (
        <div className="border-2 border-pink-500 m-4 p-4">
            <h2>status: {isConnected ? 'connected' : 'disconnected'}</h2>
            <div
                style={{
                    height: '500px',
                    overflowY: 'scroll',
                    border: 'solid black 1px',
                    padding: '10px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {messages.map((message, index) => (
                    <Message message={message} key={index} />
                ))}
            </div>
            <input
                type={'text'}
                id='message'
                onChange={(event) => {
                    const value = event.target.value.trim();
                    setMessage(value);
                }}
            ></input>
            <button
                onClick={() => {
                    if (message && message.length) {
                        socket.emit('chat', message);
                    }
                    var messageBox = document.getElementById('message');
                    messageBox.value = '';
                    setMessage('');
                }}
            >
                Send
            </button>
        </div>
    );
};
