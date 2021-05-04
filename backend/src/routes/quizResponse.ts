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

const getValidAnswers = (questions: QuestionDto[]) => {
  const questionAnswerEntries = questions.map((q) => [
    q._id,
    q.answers.filter((a) => a.isCorrect).map((a) => a._id.toString())[0],
  ]);
  return Object.fromEntries(questionAnswerEntries);
};

quizResponseRoutes.get('/points/:responseId', (req, res) => {
  const { responseId } = req.params;
  QuizResponse.findOne(
    { _id: responseId, studentId: res.locals.user._id, isEnded: true },
    { _id: 0, quizId: 1, responses: 1 },
    null,
    (err, result: Document & QuizResponseDto) => {
      if (err) {
        res.status(500).send(err);
      } else if (result) {
        const { quizId, responses } = result;

        Quiz.findOne({ _id: quizId }, null, null, (error, quiz: Document & QuizDto) => {
          if (error) {
            res.status(500).send(error);
          }
          const validAnswers = getValidAnswers(quiz.questions);
          const studentAnswers = (responses as any[]).reduce((acc, curr) => {
            const { questionId, answerId } = curr;
            return { ...acc, [questionId]: answerId.toString() };
          }, {});

          const points = Object.entries(studentAnswers).reduce((acc, current) => {
            const [questionId, answerId] = current;
            return validAnswers[questionId] === answerId ? acc + 1 : acc;
          }, 0);

          res.status(200).send({ points });
        });
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
