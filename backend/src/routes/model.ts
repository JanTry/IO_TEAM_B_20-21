export interface QuestionDto {
  _id: string;
  title: string;
  points: number;
  answers: {
    _id: string;
    data: string;
    isCorrect: boolean;
  }[];
}

export interface QuizDto {
  _id: string;
  quizName: string;
  questions: QuestionDto[];
}

export interface QuizResponseDto {
  quizId: string;
  responses: Array<{
    questionId: string;
    answerID: string;
  }>;
}
