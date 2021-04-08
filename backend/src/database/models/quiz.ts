import { model, Schema, Types } from 'mongoose';

const answerSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
});

const questionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  answers: {
    type: [answerSchema],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  validAnswers: {
    type: [Types.ObjectId],
    required: true,
  },
});

const quizSchema = new Schema(
  {
    authorId: {
      type: Types.ObjectId,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  {
    collection: 'quiz',
  }
);

export const Quiz = model('Quiz', quizSchema);
