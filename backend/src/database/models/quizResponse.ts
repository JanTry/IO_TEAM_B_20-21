import { model, Schema, Types } from 'mongoose';

const responseSchema = new Schema(
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
    isEnded: {
      type: Boolean,
      required: true,
    },
    studentId: {
      type: Types.ObjectId,
      required: true,
    },
    responses: {
      type: [responseSchema],
      required: true,
      default: [],
    },
  },
  {
    collection: 'quizResponses',
  }
);

export const QuizResponse = model('QuizResponse', quizResponseSchema);
