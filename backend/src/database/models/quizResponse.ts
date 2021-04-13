import { model, Schema, Types } from 'mongoose';

const questionResponseSchema = new Schema({
    questionId: {
        type: Types.ObjectId,
        required: true
    },
    answer: {
        type: Types.ObjectId,
        required: true,
    },
});

const quizResponseSchema = new Schema(
    {
        quizId: {
            type: Types.ObjectId,
            required: true,
        },
        studentId: {
            type: Types.ObjectId,
            required: true,
        },
        questionResponses: {
            type: [questionResponseSchema]
        }
    },
    {
      collection: 'quizResponses',
    }
)


export const QuizResponse = model('QuizResponse', quizResponseSchema);
