import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { Quiz } from '../database/models/quiz';
import { User } from '../database/models/user';

export const quizRoutes = express.Router();

quizRoutes.get('/', (req, res) => {
  Quiz.find({}, (err, results) => {
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

const authorIdValidator: CustomValidator = async (authorId) => {
  return new Promise<void>((resolve, reject) => {
    User.findOne({ _id: authorId }).then((res: any) => {
      if (res != null && res.role === 'teacher') resolve();
      else reject();
    });
  });
};

quizRoutes.post(
  '/',
  body('authorId').isMongoId().custom(authorIdValidator).withMessage('Invalid user'),
  body('questions.*.title').isString().isLength({ max: 255 }),
  body('questions.*.points').isInt({ min: 0, max: 100 }),
  body('questions.*.answers.*.data').isString().isLength({ max: 255 }),
  body('questions.*.answers').isArray().custom(atLeastOneValid),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    Quiz.create(req.body, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  }
);
