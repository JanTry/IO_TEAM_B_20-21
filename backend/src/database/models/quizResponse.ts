import { model, Schema, Types } from 'mongoose';

const questionResponseSchema = new Schema(
  {
    questionId: {
      type: Types.ObjectId,
      required: true,
    },
    answerId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { _id: false }
);

const quizResponseSchema = new Schema(
  {
    quizId: {
      type: Types.ObjectId,
      required: true,
    },
    sessionId: {
      type: Types.ObjectId,
      required: true,
    },
    studentId: {
      type: Types.ObjectId,
      required: true,
    },
    questionResponses: {
      type: [questionResponseSchema],
      required: true,
      default: [],
    },
  },
  {
    collection: 'quizResponses',
  }
);

export const QuestionResponse = model('QuestionResponse', questionResponseSchema);
export const QuizResponse = model('QuizResponse', quizResponseSchema);
