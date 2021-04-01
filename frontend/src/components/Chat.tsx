import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import io from "socket.io-client";
import './styles/Chat.css';

interface ChatMessage {
  from: string,
  msg: string,
}

const Chat = () => {
  const history = useHistory();
  const [messages, setMessages] = useState([] as string[]);
  const [userID, setUserID] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [connected, setConnected] = useState(false);

  const socket: any = useRef()

  useEffect(() => {
    socket.current = io.connect("http://localhost:4000")
    socket.current.on("chat-message", ({from, msg}: ChatMessage) => {
      console.log(messages)
      setMessages(messages.concat(`${from}: ${msg}`))
    })
    return () => socket.current.disconnect()
  }, [messages])

  useEffect(() => {
    const { userID, sessionID, accessCode } = history.location.state as { [key: string]: string };
    setUserID(userID);
    setSessionID(sessionID);
    setAccessCode(accessCode);
  }, [history.location.state])

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (event.target.message.value) {
      socket.current.emit('chat-message', event.target.message.value);
      event.target.message.value = '';
    }
  }

  const connect = () => {
    socket.current.emit('join', { userID, sessionID, accessCode }, (response: any) => {
      if (response.status === "ok") {
        setConnected(true)
      }
      else {
        console.error(response.msg)
      }
    })
  }

  return (
    <div>
      <button onClick={connect}>Connect to the server</button>
      <div>
        userID: {userID}, sessionID: {sessionID}, accessCode: {accessCode}, connected: {connected ? "yes" : "no"}
      </div>
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