import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    "origin": "*",
  }
});

app.use(cors())

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('chat-message', (message) => {
    io.emit('broadcast-message', message)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(4000, () => {
  console.log('listening on: 4000');
});