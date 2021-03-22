import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(cors())

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.sendFile(__dirname + '/static/chat.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});