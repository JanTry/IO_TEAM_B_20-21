import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './Chat.css';

const socket = socketIOClient('http://localhost:4000');

const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("broadcast-message", (message: any) => {
      setMessages(messages.concat(message));
      console.log(`received message: ${message}`);
    });
  }, [messages]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (event.target.message.value) {
      console.log(`sendig message: ${event.target.message.value}`);

      socket.emit('chat-message', event.target.message.value);
      event.target.message.value = '';
    }
  }

  return (
    <div>
      <ul id="messages">
        {
          messages.map((message, i) =>
            <li key={i}>{message}</li>
          )
        }
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input id="input" name="message" /><button>send</button>
      </form>
    </div>
  )
}

export default Chat;