import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from 'cors';
import dotenv  from "dotenv";
import * as db from './database/dbUtils';
import healthz from "./routes/healthz";


db.connect()

dotenv.config()

const PORT = process.env.PORT || 4000
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    "origin": "*",
  }
});


app.use(cors())
app.use('/healthz', healthz)

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

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
