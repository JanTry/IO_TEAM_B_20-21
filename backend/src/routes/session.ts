import express from 'express';
import { Session } from '../database/models/session';
import { teacherMiddleware } from '../middleware/auth';

export const sessionRoutes = express.Router();

sessionRoutes.get('/validate/:sessionID/:accessCode', (req, res) => {
  const { sessionID, accessCode } = req.params;
  Session.findOne({ _id: sessionID, accessCode, online: true }, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(!!result);
    }
  });
});

sessionRoutes.post('/', teacherMiddleware, (req, res) => {
  if (res.statusCode === 401) return res;
  const session = { accessCode: Math.random().toString(36).substring(2, 10), online: true };
  Session.create(session, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});
