import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { QuizResponse } from '../database/models/quizResponse';
import { Quiz } from '../database/models/quiz';
import { Session } from '../database/models/session';
import { User } from '../database/models/user';

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

const quizIdValidator: CustomValidator = async (quizId) => {
  return new Promise<void>((resolve, reject) => {
    Quiz.findOne({ _id: quizId }).then((res: any) => {
      if (res != null) resolve();
      else reject();
    });
  });
};

const sessionIdValidator: CustomValidator = async (sessionId) => {
  return new Promise<void>((resolve, reject) => {
    Session.findOne({ _id: sessionId }).then((res: any) => {
      if (res != null) resolve();
      else reject();
    });
  });
};

const studentIdValidator: CustomValidator = async (studentId) => {
  return new Promise<void>((resolve, reject) => {
    User.findOne({ _id: studentId }).then((res: any) => {
      if (res != null) resolve();
      else reject();
    });
  });
};

quizResponseRoutes.post(
  '/',
  body('quizId').isMongoId().custom(quizIdValidator).withMessage('Invalid Quiz'),
  body('sessionId').isMongoId().custom(sessionIdValidator).withMessage('Invalid Session'),
  body('studentId').isMongoId().custom(studentIdValidator).withMessage('Invalid user'),
  body('questionResponses.*.questionId').isMongoId(),
  body('questionResponses.*.answer').isMongoId(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = { ...req.body, studentId: res.locals.user._id };
    QuizResponse.create(data, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ id: result._id });
    });
  }
);

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
      { _id: quizResponseId, quizId, studentId: '6075f045aa5b0fc222216d9c' },
      { $push: { responses: { questionId, answerId } } },
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
