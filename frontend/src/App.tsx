import React, { useState, useEffect } from "react";
import "./App.css";

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

function App() {
  const [response, setResponse] = useState("");
  const socket = socketIOClient(ENDPOINT);

  // useEffect(() => {
  //   console.log("BEFORE");
  //   socket.on("chat message", (data:any) => {
  //     setResponse(data);
  //     console.log("IN CALLBACK");
      
  //   });
  //   console.log("AFTER");
  // }, [socket]);

  socket.on("chat message", (data: any) => {
    setResponse(data);
    console.log("IN CALLBACK");
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(event.target.message.value);
    if (event.target.message.value) {
        console.log(`wyslano: ${event.target.message.value}`);   
        socket.emit('chat message', event.target.value);
        console.log("AFTER EMIT");
        
        event.target.message.value = '';
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
      <form onSubmit={handleSubmit}>
        <input name="message"/><button>sned</button>
      </form>
    </div>
  );
}

export default App;
