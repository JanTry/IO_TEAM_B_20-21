import { model, Schema, Types } from 'mongoose';

const answerSchema = new Schema({
  data: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    reruired: true,
  },
});

const questionSchema = new Schema({
  title: {
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
