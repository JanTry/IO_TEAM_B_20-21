/* eslint-disable no-console */
/* eslint-disable func-names */

import { addQuizResponse } from '../collectionsUtils/quizResponseUtils';
import { User } from '../models/user';
import { Quiz } from '../models/quiz';
import { Session } from '../models/session';
import { QuestionResponse } from '../models/quizResponse';

export const populateQuizResponseCollection = async (n = 10, studentMin = 30, studentMax = 30) => {
  for (let i = 1; i <= n; i++) {
    const studentsAnswering = studentMin + Math.floor(Math.random() * (studentMax - studentMin));
    Session.count().exec(function (err1, sessionCount) {
      const sessionSkip = Math.floor(Math.random() * sessionCount);
      Session.findOne()
        .skip(sessionSkip)
        .exec(function (err2, sessionResult) {
          Quiz.count().exec(function (err3, quizCount) {
            const quizSkip = Math.floor(Math.random() * quizCount);
            Quiz.findOne()
              .skip(quizSkip)
              .exec(function (err4, quizResult) {
                for (let j = 1; j <= studentsAnswering; j++) {
                  const questionResponses = [];
                  const questions = quizResult.get('questions');
                  for (let k = 0; k < questions.length; k++) {
                    const answers = questions[k].get('answers');
                    const randomAnswer = Math.floor(Math.random() * answers.length);
                    questionResponses.push(
                      new QuestionResponse({
                        questionId: questions[k]._id,
                        answerId: answers[randomAnswer]._id,
                      })
                    );
                  }

                  User.count({ role: 'student' }).exec(function (err5, count) {
                    const random = Math.floor(Math.random() * count);
                    User.findOne({ role: 'student' })
                      .skip(random)
                      .exec(function (err, studentResult) {
                        addQuizResponse({
                          quizId: quizResult._id,
                          sessionId: sessionResult._id,
                          studentId: studentResult._id,
                          questionResponses,
                        });
                      });
                  });
                }
              });
          });
        });
    });
  }
  console.log('Multiple new responses for', n, 'quizes added to quizResponses');
};
