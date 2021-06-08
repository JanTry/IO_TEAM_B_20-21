import express from 'express';
import { body, validationResult } from 'express-validator';
import { Document } from 'mongoose';
import { QuizResponse } from '../database/models/quizResponse';
import { Quiz } from '../database/models/quiz';
import { QuestionDto, QuizDto, QuizResponseDto } from './model';
import { quizIdValidator, sessionIdValidator } from './validators';

export const quizResponseRoutes = express.Router();

quizResponseRoutes.get('/', (req, res) => {
  QuizResponse.find({}, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

quizResponseRoutes.post(
  '/',
  body('quizId').isMongoId().custom(quizIdValidator).withMessage('Invalid Quiz'),
  body('sessionId').isMongoId().custom(sessionIdValidator).withMessage('Invalid session Id'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = { ...req.body, studentId: res.locals.user._id, isEnded: false };
    QuizResponse.create(data, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ id: result._id });
    });
  }
);

const getQuestionMetadata = (questions: QuestionDto[]) => {
  return questions.reduce((acc, current) => {
    const questionData = {
      points: current.points,
      correctAnswers: current.answers.filter((a) => a.isCorrect).map((a) => a._id.toString()),
    };
    return { ...acc, [current._id.toString()]: questionData };
  }, {} as Record<string, { points: number; correctAnswers: string[] }>);
};

quizResponseRoutes.get('/points/:responseId', (req, res) => {
  const { responseId } = req.params;
  QuizResponse.findOne(
    { _id: responseId, studentId: res.locals.user._id, isEnded: true },
    { _id: 0, quizId: 1, questionResponses: 1 },
    null,
    (err, result: Document & QuizResponseDto) => {
      if (err) {
        res.status(500).send(err);
      } else if (result) {
        const { quizId, questionResponses } = result;

        Quiz.findOne({ _id: quizId }, null, null, (error, quiz: Document & QuizDto) => {
          if (error) {
            res.status(500).send(error);
          }
          const questionMetadata = getQuestionMetadata(quiz.questions);

          const points = questionResponses.reduce((acc, { questionId, answerId }) => {
            const metadata = questionMetadata[questionId.toString()] ?? { points: 0, correctAnswers: [] };
            return metadata.correctAnswers.find((a) => a === answerId.toString()) ? acc + metadata.points : acc;
          }, 0);

          res.status(200).send({ points });
        });
      } else {
        res.sendStatus(500);
      }
    }
  );
});

quizResponseRoutes.put(
  '/',
  body('quizResponseId').isMongoId(),
  body('quizId').isMongoId().custom(quizIdValidator).withMessage('Invalid Quiz'),
  body('questionId').isMongoId(),
  body('answerId').isMongoId(),
  (req, res) => {
    const { quizResponseId, quizId, questionId, answerId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    QuizResponse.updateOne(
      { _id: quizResponseId, quizId, studentId: res.locals.user._id },
      { $push: { questionResponses: { questionId, answerId } } },
      null,
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      }
    );
  }
);
