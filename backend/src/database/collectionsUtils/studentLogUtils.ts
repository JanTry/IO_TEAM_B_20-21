import { StudentLog } from '../models/studentLog';
import { User } from '../models/user'
 
export const addStudentLog = async (logData) => {
  return new StudentLog(logData).save();
};

export const logUserJoin = async (studentId, sessionId) => {
    User.findOne({_id: studentId, role:'student'}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            addStudentLog({
                studentId: studentId,
                sessionId: sessionId,
                eventType: 'join',
              });
        }
    });

    // addStudentLog({
    //     studentId: studentId,
    //     sessionId: sessionId,
    //     eventType: 'join',
    //   });
}

export const logUserLeave = async (studentId, sessionId) => {
    User.findOne({_id: studentId, role:'student'}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            addStudentLog({
                studentId: studentId,
                sessionId: sessionId,
                eventType: 'leave',
              });
        }
    });
    // addStudentLog({
    //     studentId: studentId,
    //     sessionId: sessionId,
    //     eventType: 'leave',
    // })
}

export const getSessionLogs = async (sessionId) => {
    const query = { "sessionId": sessionId };
    const projection = { "_id" : 0 };
    return await StudentLog.find(query, projection).sort({'time': 1})
};