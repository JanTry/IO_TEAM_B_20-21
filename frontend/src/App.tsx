import React, { useState, useEffect } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

const socket = socketIOClient('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("broadcast-message", (message: any) => {
      setMessages(messages.concat(message));
      console.log(message);
    });
  }, [messages]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (event.target.message.value) {
      console.log(`sendig ${event.target.message.value}`);
      
        socket.emit('chat-message', event.target.message.value);       
        event.target.message.value = '';
    }
  }

  return (
    <div>
      <ul>
      {
        messages.map((message, i) =>
          <li key={i}>{message}</li>
        )
      }
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="message"/><button>sned</button>
      </form>
    </div>
  );
}

export default App;
