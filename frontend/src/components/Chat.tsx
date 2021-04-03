import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from "socket.io-client";
import './styles/Chat.css';

const socket = io.connect("http://localhost:4000");

interface ChatMessage {
  from: string,
  msg: string,
}

const Chat = () => {
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as string[]);
  const [userID, setUserID] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const { userID, sessionID, accessCode } = history.location.state as { [key: string]: string };
    setUserID(userID);
    setSessionID(sessionID);
    setAccessCode(accessCode);

    socket.emit('join', { userID, sessionID, accessCode }, (response: any) => {
      if (response.status === "ok") {
        setConnected(true)
      } else {
        console.error(response.msg)
      }
    })
  }, [history.location.state])



  useEffect(() => {
    socket.on("chat-message", ({ from, msg }: ChatMessage) => {
      setMessage(`${from}: ${msg}`);
    })
  }, [message]);

  useEffect(() => {
    if (message !== '') {
      setMessages(messages.concat(message))
    }
  }, [message])

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (event.target.message.value) {
      socket.emit('chat-message', event.target.message.value);
      event.target.message.value = '';
    }
  }

  return (
    <div>
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