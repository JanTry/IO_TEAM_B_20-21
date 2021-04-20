import { addQuizResponse } from '../collectionsUtils/quizResponseUtils';
import { User } from '../models/user';
import { Quiz } from '../models/quiz';
import { Session } from '../models/session';
import { QuestionResponse } from '../models/quizResponse';
import faker from 'faker';

export const populateQuizResponseCollection = async (n = 10, student_min = 30, student_max = 30) => {
    var total_responses_added = 0
    for (let i = 1; i <= n; i++) {
        var students_answering = student_min + Math.floor(Math.random() * (student_max - student_min));
        total_responses_added += students_answering
        Session.count().exec(function(err, session_count){
            var session_skip = Math.floor(Math.random() * session_count);
            Session.findOne().skip(session_skip).exec(
                function (err, session_result) {
                    Quiz.count().exec(function(err, quiz_count){
                        var quiz_skip = Math.floor(Math.random() * quiz_count);
                        Quiz.findOne().skip(quiz_skip).exec(
                            function (err, quiz_result) {
                                
                                for(let j = 1; j <= students_answering; j++){
                                    var questionResponses = []
                                    var questions = quiz_result.get('questions')
                                    for(let k = 0; k < questions.length; k++){
                                        var answers = questions[k].get('answers')
                                        var random_answer = Math.floor(Math.random() * answers.length);
                                        questionResponses.push(new QuestionResponse({
                                                questionId: questions[k]._id,
                                                answer:  answers[random_answer]._id,
                                            })
                                        )
                                    }
                                    
                                    User.count({role: 'student'}).exec(function(err, count){
                                        var random = Math.floor(Math.random() * count);
                                        User.findOne({role: 'student'}).skip(random).exec(
                                            function (err, student_result) {
                                            addQuizResponse({
                                                quizId: quiz_result._id,
                                                sessionId: session_result._id,
                                                studentId: student_result._id,
                                                questionResponses: questionResponses,
                                            });
                                        });
                                    });
                                }
                        });
                    });
           });
        });
    }
    console.log('Multiple new responses for', n ,'quizes added to quizResponses')
};
