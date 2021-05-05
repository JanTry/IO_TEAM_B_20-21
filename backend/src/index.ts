/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import dbConnect from './database/dbUtils';
import healthzRoutes from './routes/healthz';
import { authRoutes } from './routes/auth';
import { sessionRoutes } from './routes/session';
import { Session } from './database/models/session';
import { quizRoutes } from './routes/quiz';
import { quizResponseRoutes } from './routes/quizResponse';
import { authMiddleware } from './middleware/auth';
import { populateDatabase } from './database/dbPopulate';

dbConnect();

// UNCOMMENT FOLLOWING LINE FOR DATABASE POPULATION
populateDatabase();

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/healthz', healthzRoutes);
app.use('/auth', authRoutes);
app.use('/session', authMiddleware, sessionRoutes);
app.use('/quiz', authMiddleware, quizRoutes);
app.use('/quizResponse', authMiddleware, quizResponseRoutes);

type ChatSocket = Socket & {
  userID: string;
  sessionID: string;
};

io.on('connection', (socket: ChatSocket) => {
  console.log('user connected');

  socket.on('chat-message', (msg) => {
    io.in(socket.sessionID).emit('chat-message', { from: socket.userID, msg });
  });

  socket.on('join', ({ userID, sessionID }, callback) => {
    const session = Session.findOne({ _id: sessionID, online: true });
    if (session) {
      socket.userID = userID;
      socket.sessionID = sessionID;
      socket.join(sessionID);
      callback({
        status: 'ok',
        msg: 'Success',
      });
      console.log(`User ${userID} joined room ${sessionID}`);
    } else {
      callback({
        status: 'error',
        msg: "Session doesn't exist or it's offline.",
      });
    }
  });

  socket.on('start-quiz', (quizId) => {
    console.log(quizId);
    socket.to(socket.sessionID).emit('start-quiz', { quizId });
  });

  socket.on('end-quiz', (msg) => {
    console.log(msg);
    socket.to(socket.sessionID).emit('end-quiz');
  });

  socket.on('disconnect', () => {
    socket.leave(socket.id);
    socket.leave(socket.sessionID);
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
