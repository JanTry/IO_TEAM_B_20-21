import { QuizResponse } from '../models/quizResponse';

export const addQuizResponse = async (quizResponseData) => {
  return new QuizResponse(quizResponseData).save();
};
