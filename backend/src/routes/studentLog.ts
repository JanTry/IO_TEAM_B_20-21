import express from 'express';
import { StudentLog } from '../database/models/studentLog';

export const logRoutes = express.Router();

logRoutes.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  StudentLog.find({ sessionId }, { _id: 0, sessionId: 0 }, null, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});
