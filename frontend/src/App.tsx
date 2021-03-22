import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const socket = io();
    let messages: any[] = []
    
    const submitForm = (event: any) => {
      event.preventDefault();
      if (event.target.value) {
          socket.emit('chat message', event.target.value);
          event.target.value = '';
      }
    }

    socket.on('chat message', msg: any => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages = messages.concat(msg)
      window.scrollTo(0, document.body.scrollHeight);
  });

  return (

  <div>
    <ul>
      {
        messages.map(message => 
          <li>message

          </li>)
      }
    </ul>
    <form onSubmit={submitForm}>
      <input id="input"/><button>Send</button>
    </form>

    
  </div>
  );
}

export default App;
