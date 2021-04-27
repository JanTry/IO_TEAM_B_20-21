import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { Document } from 'mongoose';
import { Quiz } from '../database/models/quiz';

export const quizRoutes = express.Router();

type QuizModel = Document & {
  quizName: string;
  questions: any[];
};

quizRoutes.get('/', (req, res) => {
  Quiz.find({ authorId: res.locals.user._id }, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(
        results.map((elem: QuizModel) => {
          return {
            id: elem._id,
            name: elem.quizName,
            questions: elem.questions.length,
          };
        })
      );
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
  body('quizName').isString().isLength({ min: 0, max: 100 }),
  body('questions.*.title').isString().isLength({ max: 255 }),
  body('questions.*.points').isInt({ min: 0, max: 100 }),
  body('questions.*.answers.*.data').isString().isLength({ max: 255 }),
  body('questions.*.answers').isArray().custom(atLeastOneValid),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = { ...req.body, authorId: res.locals.user._id };
    Quiz.create(data, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  }
);
