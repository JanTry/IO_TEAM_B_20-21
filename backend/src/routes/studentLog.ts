import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import StudentLog from '../database/models/studentLog';
// import User from '../database/models/user';

export const logRoutes = express.Router();

// logRoutes.get('/logs/:sessionId', (req, res) => {
//     const { sessionId } = req.params;
//     StudentLog.find({ sessionId: sessionId }, { _id: 0, sessionId: 0 }, null, (err, results) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         var sorted_results = results.sort({ time: 1});
//         res.status(200).send(sorted_results);
//       }
//     });
//   });

logRoutes.get('/logs/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    // StudentLog.find().populate('').exec(function(err, users) {
    //     if (err) throw err;
    
    //     var adTimes = [];
    //     users.forEach(function(user) {
    //         user.friends.forEach(function(friend) {
    //             adTimes.push(friend.adTime);
    //         });
    //     });
    
    //     response.send(adTimes); // adTimes should contain all addTimes from his friends
    // });
    StudentLog.find({ sessionId: sessionId }, { _id: 0, sessionId: 0 }, null, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        var sorted_results = results.sort({ time: 1});
        res.status(200).send(sorted_results);
      }
    });
  });