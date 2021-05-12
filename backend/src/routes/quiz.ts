import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { ObjectID } from 'mongodb';
import { Quiz } from '../database/models/quiz';

export const quizRoutes = express.Router();

quizRoutes.get('/', (req, res) => {
  Quiz.find({ authorId: res.locals.user._id }, { _id: 1 }, null, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results.map((elem) => elem._id));
    }
  });
});

quizRoutes.get('/questions/:quizId', (req, res) => {
  const { quizId } = req.params;
  Quiz.findOne({ _id: quizId }, { _id: 0, questions: 1 }, null, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

const atLeastOneValid: CustomValidator = (answers) => {
  return answers.some((answer) => answer.isCorrect);
};

quizRoutes.post(
  '/',
  body('questions.*.title').isString().isLength({ max: 255 }),
  body('questions.*.points').isInt({ min: 0, max: 100 }),
  body('questions.*.answers.*.data').isString().isLength({ max: 255 }),
  body('questions.*.answers').isArray().custom(atLeastOneValid),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const typedBody = req.body as {
      quizName: string;
      questions: Array<{ title: string; points: number; answers: Array<{ data: string; isCorrect: boolean }> }>;
    };
    const questions = typedBody.questions.map((q) => {
      const answers = q.answers.map((a) => ({ ...a, _id: new ObjectID() }));
      return { ...q, answers };
    });
    const data = { ...req.body, questions, authorId: res.locals.user._id };
    Quiz.create(data, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  }
);
