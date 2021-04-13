import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import get from 'lodash.get';
import { QuizResponse } from '../database/models/quizResponse';
import { User } from '../database/models/user';
import { Quiz } from '../database/models/quiz';

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

const validAnswersValidator: CustomValidator = (validAnswersIds, meta) => {
  const path = `${meta.path.split('.').splice(0, 1).join('.')}.answers`;
  const answers = get(meta.req.body, path);
  return validAnswersIds.every((id) => answers.find((a) => a._id === id) != null);
};

const studentIdValidator: CustomValidator = async (studentId) => {
  return new Promise<void>((resolve, reject) => {
    User.findOne({ _id: studentId }).then((res: any) => {
      if (res != null && res.role === 'student') resolve();
      else reject();
    });
  });
};

const quizIdValidator: CustomValidator = async (quizId) => {
    return new Promise<void>((resolve, reject) => {
        Quiz.findOne({ _id: quizId }).then((res: any) =>{
            if (res != null) resolve();
            else reject();
        })
    })
}

quizResponseRoutes.post(
    '/',
    body('quizId').isMongoId().custom(quizIdValidator).withMessage('Invalid Quiz'),
    body('studentId').isMongoId().custom(authorIdValidator).withmessage('Invalid user'),
    body('questionResponses.*.questionId').isMongoId(),
    body('questionResponses.*.answer').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        QuizResponse.create(req.body, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).send(result);
        });
    }
)


