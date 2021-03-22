import React, { useState, useEffect } from "react";
import "./App.css";

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";

function App() {
  const [response, setResponse] = useState("");
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.on("chat message", (data:any) => {
      setResponse(data);
    });
  }, [socket]);


  const submitForm = (event: any) => {
    event.preventDefault();
    if (event.target.value) {
        socket.emit('chat message', event.target.value);
        event.target.value = '';
    }
  }

  // socket.on('chat message', msg: any) => {
  //   const item = document.createElement('li');
  //   item.textContent = msg;
  //   messages = messages.concat(msg)
  //   window.scrollTo(0, document.body.scrollHeight);
  // });

  return (
    <div>
      <p>{response}</p>
    </div>
  );
}

export default App;
