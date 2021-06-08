import express from 'express';
import { body, validationResult } from 'express-validator';
import { Document } from 'mongoose';
import { QuizResponse } from '../database/models/quizResponse';
import { Quiz } from '../database/models/quiz';
import { QuizDto, QuizResponseDto } from './model';
import { quizIdValidator, sessionIdValidator } from './validators';
import { getMaxPoints, getPoints, getQuestionMetadata, quizHistogram } from '../shared/quizHistogram';
import { teacherMiddleware } from '../middleware/auth';

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

quizResponseRoutes.get('/histogram/:quizId', teacherMiddleware, async (req, res) => {
  if (res.statusCode === 401) return res;
  const { quizId } = req.params;
  const result = await quizHistogram(quizId);
  res.send(result);
});

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
          if (error) res.status(500).send(error);

          const questionMetadata = getQuestionMetadata(quiz.questions);
          const maxPoints = getMaxPoints(questionMetadata);
          const points = getPoints(questionResponses, questionMetadata);

          res.status(200).send({ points, maxPoints });
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
