import { Quiz } from '../models/quiz';

export const addQuiz = async (quizData) => {
    return new Quiz(quizData).save();
};