import { Document } from 'mongoose';
import { Quiz } from '../database/models/quiz';
import { QuestionDto, QuizDto, QuizResponseDto } from '../routes/model';
import { QuizResponse } from '../database/models/quizResponse';

export const getQuestionMetadata = (questions: QuestionDto[]) => {
  return questions.reduce((acc, current) => {
    const questionData = {
      points: current.points,
      correctAnswers: current.answers.filter((a) => a.isCorrect).map((a) => a._id.toString()),
    };
    return { ...acc, [current._id.toString()]: questionData };
  }, {} as Record<string, { points: number; correctAnswers: string[] }>);
};

export function getPoints(
  questionResponses: QuizResponseDto['questionResponses'],
  questionMetadata: { [p: string]: { correctAnswers: string[]; points: number } }
) {
  return questionResponses.reduce((acc, { questionId, answerId }) => {
    const metadata = questionMetadata[questionId.toString()] ?? { points: 0, correctAnswers: [] };
    return metadata.correctAnswers.find((a) => a === answerId.toString()) ? acc + metadata.points : acc;
  }, 0);
}

export function getMaxPoints(questionMetadata: { [p: string]: { correctAnswers: string[]; points: number } }) {
  return Object.values(questionMetadata)
    .map((x) => x.points)
    .reduce((acc, curr) => acc + curr, 0);
}

export const quizHistogram = async (quizId: string) => {
  const quiz = (await Quiz.findOne({ _id: quizId })) as Document & QuizDto;
  const questionMetadata = getQuestionMetadata(quiz.questions);
  const results = (await QuizResponse.find(
    { quizId, isEnded: true },
    { _id: 0, quizId: 1, questionResponses: 1, studentId: 1 }
  )) as Array<Document & QuizResponseDto>;
  const points = results.map((r) => {
    const { questionResponses } = r;
    return getPoints(questionResponses, questionMetadata);
  });
  const maxPoints = getMaxPoints(questionMetadata);
  const histogram = Object.fromEntries(Array.from(Array(maxPoints).keys()).map((x) => [x, 0]));
  points.forEach((p) => {
    histogram[p] += 1;
  });
  return histogram;
};
