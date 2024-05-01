import React, { useState, useEffect } from 'react';

export function ChatApp() {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [chatSocket, setChatSocket] = useState(null);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log('Message received:', data.message);
      };

      chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
      };

      chatSocket.onerror = function(error) {
        console.error('WebSocket error:', error);
      };
    }
  }, [chatSocket]);

  const joinRoom = () => {
    const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${room}/`);
    setChatSocket(socket);
  };

  const sendMessage = () => {
    if (message !== '' && chatSocket) {
      chatSocket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <div>
      <input type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="Room Name" />
      <button onClick={joinRoom}>Join Room</button>
      <h1>Chat in Room: {room}</h1>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
