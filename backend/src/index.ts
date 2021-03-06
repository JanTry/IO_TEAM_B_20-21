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
import { logUserJoin, logUserLeave } from './database/collectionsUtils/studentLogUtils';
import { logRoutes } from './routes/studentLog';
import { QuizResponse } from './database/models/quizResponse';
// import { populateDatabase, createSampleUsers } from './database/dbPopulate';

dbConnect();

// UNCOMMENT FOLLOWING LINE FOR DATABASE POPULATION
// populateDatabase();
// UNCOMMENT FOLLOWING LINE FOR USERS DB MOCKUP (teacherNumber, studentNumber)
// createSampleUsers(1, 3);

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
app.use('/studentLog', logRoutes);

type ChatSocket = Socket & {
  userId: string;
  sessionId: string;
};

const reactions = {};

io.on('connection', (socket: ChatSocket) => {
  console.log('user connected');

  socket.on('chat-message', (msg) => {
    io.in(socket.sessionId).emit('chat-message', { from: socket.userId, msg });
  });

  socket.on('join', ({ userId, sessionId }, callback) => {
    const session = Session.findOne({ _id: sessionId, online: true });
    if (session) {
      socket.userId = userId;
      socket.sessionId = sessionId;
      socket.join(sessionId);
      callback({
        status: 'ok',
        msg: 'Success',
      });
      console.log(`User ${userId} joined room ${sessionId}`);
      io.in(socket.sessionId).emit('reactions', reactions[sessionId] || {});
      logUserJoin(userId, sessionId);
    } else {
      callback({
        status: 'error',
        msg: "Session doesn't exist or it's offline.",
      });
    }
  });

  socket.on('start-quiz', (quizId) => {
    console.log(`starting quiz with id: ${quizId} in room ${socket.sessionId}`);
    socket.to(socket.sessionId).emit('start-quiz', { quizId });
  });

  socket.on('end-quiz', (quizId) => {
    QuizResponse.updateMany({ sessionId: socket.sessionId, quizId }, { $set: { isEnded: true } }, null, () =>
      socket.to(socket.sessionId).emit('end-quiz')
    );
  });

  socket.on('reaction', (reactionId) => {
    console.log(`user ${socket.userId} reaction ${reactionId}`);
    const sessionReactions = reactions[socket.sessionId] || {};
    const reactionMap =  sessionReactions[reactionId] || {};
    reactionMap[socket.userId] = new Date();
    sessionReactions[reactionId] = reactionMap;
    reactions[socket.sessionId] = sessionReactions;
    io.in(socket.sessionId).emit('reactions', sessionReactions);
  });

  socket.on('disconnect', () => {
    socket.leave(socket.id);
    logUserLeave(socket.userId, socket.sessionId);
    socket.leave(socket.sessionId);
    console.log(`user ${socket.userId} disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
