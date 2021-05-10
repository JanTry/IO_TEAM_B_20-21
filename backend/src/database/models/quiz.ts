import { model, Schema, Types } from 'mongoose';

const answerSchema = new Schema({
  data: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
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
    quizName: {
      type: String,
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

export const Answer = model('Answer', answerSchema);
export const Question = model('Question', questionSchema);
export const Quiz = model('Quiz', quizSchema);

export interface Question {
  _id: string;
  title: string;
  points: number;
  answers: {
    _id: string;
    data: string;
    isCorrect: boolean;
  }[];
}

export interface QuizModel {
  _id: string;
  quizName: string;
  questions: Question[];
}
