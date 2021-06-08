import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { Document } from 'mongoose';
import { ObjectID } from 'mongodb';
import { Quiz } from '../database/models/quiz';
import { teacherMiddleware } from '../middleware/auth';
import { QuestionDto, QuizDto } from './model';

export const quizRoutes = express.Router();

quizRoutes.get('/', teacherMiddleware, (req, res) => {
  if (res.statusCode === 401) return res;
  Quiz.find({ authorId: res.locals.user._id }, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(
        results.map((elem: Document & QuizDto) => {
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

const mapQuestions = (questions: QuestionDto[]) => {
  return questions.map((q) => {
    return {
      _id: q._id,
      title: q.title,
      points: q.points,
      answers: q.answers.map((a) => ({ _id: a._id, data: a.data })),
    };
  });
};

quizRoutes.get('/questions/:quizId', (req, res) => {
  const { quizId } = req.params;
  Quiz.findOne(
    { _id: quizId },
    { _id: 0, questions: 1 },
    null,
    (err, result: Document & { questions: QuestionDto[] }) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(mapQuestions(result.questions));
      }
    }
  );
});

const atLeastOneValid: CustomValidator = (answers) => {
  return answers.some((answer) => answer.isCorrect);
};

quizRoutes.post(
  '/',
  body('quizName').isString().isLength({ min: 0, max: 64 }),
  body('questions.*.title').isString().isLength({ max: 255 }),
  body('questions.*.points').isInt({ min: 0, max: 100 }),
  body('questions.*.answers.*.data').isString().isLength({ max: 255 }),
  body('questions.*.answers').isArray().custom(atLeastOneValid),
  teacherMiddleware,
  (req, res) => {
    if (res.statusCode === 401) return res;
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
