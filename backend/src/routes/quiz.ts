import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import { Document } from 'mongoose';
import { Quiz } from '../database/models/quiz';
import { teacherMiddleware } from '../middleware/auth';

export const quizRoutes = express.Router();

interface Question {
  _id: string;
  title: string;
  points: number;
  answers: {
    _id: string;
    data: string;
    isCorrect: boolean;
  }[];
}

type QuizModel = Document & {
  _id: string;
  quizName: string;
  questions: Question[];
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

const mapQuestions = (questions: Question[]) => {
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
  Quiz.findOne({ _id: quizId }, { _id: 0, questions: 1 }, null, (err, result: Document & { questions: Question[] }) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(mapQuestions(result.questions));
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
  teacherMiddleware,
  (req, res) => {
    if (res.statusCode === 401) return res;
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
