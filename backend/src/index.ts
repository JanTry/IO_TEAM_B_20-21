import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from 'cors';
import dotenv  from "dotenv";
import {User} from './database/models/user'
import * as db from './database/dbUtils';
import { body, validationResult } from "express-validator";
import {ObjectId} from 'mongodb';
import * as users from './database/collectionsUtils/userUtils'
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

app.use(express.json());

app.post('/api/v1/register',
          body('email').isEmail(),
          body('password').isLength({ min: 8 }),
          (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            const userData = {email: req.body.email,
                              password: req.body.password,
                              id: new ObjectId()};
            console.log(userData);
            const result = users.addUser(userData);
            console.log(result);
            res.status(200).send('Welcome to login , sign-up api');
          });

app.post('/api/v1/auth/login',
          body('email').isEmail(),
          body('password').isLength({ min: 8 }),
          (req,res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            const password = User.findOne({password: req.body.password});
            if(password === req.body.password){
              res.status(200).send('Welcome to login , sign-up api');
            }
            else{
              res.status(400).json({errors: [{auth: "Invalid password or user"}]});
            }

          });

app.post('/api/v1/auth/create-user',
          (req,res) => {
            res.status(200).send('Welcome to login , sign-up api');
          });

