import { Question, Answer } from '../models/quiz';
import { User } from '../models/user';
import { addQuiz } from '../collectionsUtils/quizUtils';
import faker from 'faker';

export const populateQuizCollection = async (n = 10) => {
    for (let i = 1; i <= n; i++) {
        const questions = [];
        var questions_number = 1 + Math.floor(Math.random() * 5);
        for (let j = 1; j <= questions_number; j++){
            const answers = []
            var answers_number = 2 + Math.floor(Math.random() * 3);
            var random_correct = 1 + Math.floor(Math.random() * 4);
            for (let k = 1; k <= answers_number; k++){
                answers.push(new Answer({
                        data: faker.vehicle.vehicle(),
                        isCorrect: random_correct == k
                    })
                )
            }
            questions.push( new Question({ 
                    title: faker.lorem.words(5)+'?',
                    answers: answers,
                    points: 1 + Math.floor(Math.random() * 3)
                })
            )
        }
        User.count({role: 'teacher'}).exec(function(err, count){
        var random = Math.floor(Math.random() * count);
        User.findOne({role: 'teacher'}).skip(random).exec(
            function (err, result) {
            addQuiz({
                authorId: result._id,
                questions: questions
            });
        });
        });
    }
    console.log(n,'new quizes added to quiz')
};