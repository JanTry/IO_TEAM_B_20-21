import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import get from 'lodash.get';
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

const validAnswersValidator: CustomValidator = (validAnswersIds, meta) => {
  const path = `${meta.path.split('.').splice(0, 1).join('.')}.answers`;
  const answers = get(meta.req.body, path);
  return validAnswersIds.every((id) => answers.find((a) => a._id === id) != null);
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
  body('questions.*.text').isString().isLength({ max: 255 }),
  body('questions.*.points').isInt({ min: 0, max: 100 }),
  body('questions.*.answers.*._id').isMongoId(),
  body('questions.*.answers.*.text').isString().isLength({ max: 255 }),
  body('questions.*.validAnswers').isArray({ min: 1 }).custom(validAnswersValidator),
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
