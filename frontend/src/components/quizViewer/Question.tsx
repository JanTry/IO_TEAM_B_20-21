import React from 'react';

export interface AnswerValue {
  data: string;
  isCorrect: boolean;
}

export interface QuestionValue {
  title: string;
  answers: AnswerValue[];
}

interface QuestionProps {
  question: QuestionValue;
}

const Question: React.FunctionComponent<QuestionProps> = (props: QuestionProps) => {
  const { question } = props;
  return (
    <div>
      <h2>title: {question.title}</h2>
      {question.answers.map((answer, i) => (
        <div key={question.title}>
          <p>answer {i}</p>
          <p>data: {answer.data}</p>
          <p>isCorrect: {answer.isCorrect.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Question;
