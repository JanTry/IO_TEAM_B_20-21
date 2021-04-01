import express from "express";
import http from "http";
import {Server, Socket} from "socket.io";
import cors from 'cors';
import dotenv  from "dotenv";
import * as db from './database/dbUtils';
import healthz from "./routes/healthz";
import auth from "./routes/auth";
import {sessions} from "./routes/sessions";
import {Session} from "./database/models/session";

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


app.use(cors());
app.use(express.json());
app.use('/healthz', healthz);
app.use('/auth', auth);
app.use('/sessions', sessions);

type ChatSocket = Socket & {
  userID: string,
  sessionID: string,
}

io.on('connection', (socket: ChatSocket) => {
  console.log('user connected');

  socket.on('chat-message', (msg) => {
    io.in(socket.sessionID).emit('chat-message', {from: socket.userID, msg})
  });

  socket.on('join', ({userID, sessionID}, callback) => {
    const session = Session.findOne({_id: sessionID, online: true});
    if (session) {
      socket.userID = userID
      socket.sessionID = sessionID
      socket.join(sessionID)
      callback({
        status: "ok",
        msg: "Success"
      })
      console.log(`User ${userID} joined room ${sessionID}`)
    } else {
      callback({
        status: "error",
        msg: "Session doesn't exist or it's offline."
      })
    }
  })

  socket.on('disconnect', () => {
    socket.leave(socket.id);
    socket.leave(socket.sessionID);
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});


