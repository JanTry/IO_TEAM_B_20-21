/* eslint-disable no-console */
/* eslint-disable func-names */

import faker from 'faker';
import { Question, Answer } from '../models/quiz';
import { User } from '../models/user';
import { addQuiz } from '../collectionsUtils/quizUtils';

export const populateQuizCollection = async (n = 10) => {
  for (let i = 1; i <= n; i++) {
    const questions = [];
    const questionsNumber = 1 + Math.floor(Math.random() * 5);
    for (let j = 1; j <= questionsNumber; j++) {
      const answers = [];
      const answersNumber = 2 + Math.floor(Math.random() * 3);
      const randomCorrect = 1 + Math.floor(Math.random() * 4);
      for (let k = 1; k <= answersNumber; k++) {
        answers.push(
          new Answer({
            data: faker.vehicle.vehicle(),
            isCorrect: randomCorrect === k,
          })
        );
      }
      questions.push(
        new Question({
          title: `${faker.lorem.words(5)}?`,
          answers,
          points: 1 + Math.floor(Math.random() * 3),
        })
      );
    }
    User.count({ role: 'teacher' }).exec(function (err, count) {
      const random = Math.floor(Math.random() * count);
      User.findOne({ role: 'teacher' })
        .skip(random)
        .exec(function (err2, result) {
          addQuiz({
            authorId: result._id,
            questions,
          });
        });
    });
  }
  console.log(n, 'new quizes added to quiz');
};
