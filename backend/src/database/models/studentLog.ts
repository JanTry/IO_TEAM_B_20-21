// import { model, Schema, Types, Document } from 'mongoose';
import mongoose from 'mongoose';

export interface StudentLogType{
  studentId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  eventType: string;
  time?: Date;
}

const studentLogSchema = new mongoose.Schema(
    { 
        studentId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        sessionId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        eventType: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: 'studentLogs',
    }
)

export const StudentLog = mongoose.model('studentLog', studentLogSchema);