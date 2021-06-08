import { Types } from 'mongoose';

export interface QuestionDto {
  _id: Types.ObjectId;
  title: string;
  points: number;
  answers: {
    _id: Types.ObjectId;
    data: string;
    isCorrect: boolean;
  }[];
}

export interface QuizDto {
  _id: Types.ObjectId;
  quizName: string;
  questions: QuestionDto[];
}

export interface QuizResponseDto {
  quizId: Types.ObjectId;
  questionResponses: Array<{
    questionId: Types.ObjectId;
    answerId: Types.ObjectId;
  }>;
}
