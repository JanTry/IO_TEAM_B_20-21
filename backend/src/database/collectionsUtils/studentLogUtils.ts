/* eslint-disable no-console */
/* eslint-disable func-names */

import { StudentLog } from '../models/studentLog';
import { User } from '../models/user';

export const addStudentLog = async (logData) => {
  return new StudentLog(logData).save();
};

export const logUserJoin = async (studentId, sessionId) => {
  if(!sessionId || !studentId) return;
  const names = studentId.split(" ");
  User.findOne({ firstName: names[0], lastName: names[1], role: 'student' }, (err, user) => {
    if (err) {
      console.log(err);
    } 
    else if(user){
      addStudentLog({
        studentId: user._id,
        studentName: studentId,
        sessionId,
        eventType: 'join',
      });
    }
  });
};

export const logUserLeave = async (studentId, sessionId) => {
  if(!sessionId || !studentId) return;
  const names = studentId.split(" ");
  User.findOne({ firstName: names[0], lastName: names[1], role: 'student' }, (err, user) => {
    if (err) {
      console.log(err);
    } 
    else if(user) {
      addStudentLog({
        studentId: user._id,
        studentName: studentId,
        sessionId,
        eventType: 'leave',
      });
    }
  });
};

export const getSessionLogs = async (sessionId) => {
  const query = { sessionId };
  const projection = { _id: 0 };
  return StudentLog.find(query, projection).sort({ time: 1 });
};
