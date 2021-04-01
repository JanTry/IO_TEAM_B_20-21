import { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import './styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const socket: any = useRef()

  useEffect(() => {
    socket.current = io.connect("http://localhost:4000")
    socket.current.on("broadcast-message", (message: any) => {
      setMessages(messages.concat(message))
    })
    return () => socket.current.disconnect()
  }, [messages])

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (event.target.message.value) {
      socket.current.emit('chat-message', event.target.message.value);
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