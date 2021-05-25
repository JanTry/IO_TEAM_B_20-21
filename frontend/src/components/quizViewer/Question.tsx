import React from 'react';
import { Table } from 'react-bootstrap';

export interface AnswerValue {
  data: string;
  isCorrect: boolean;
}

export interface QuestionValue {
  title: string;
  answers: AnswerValue[];
  points: number;
}

interface QuestionProps {
  question: QuestionValue;
}

const Question: React.FunctionComponent<QuestionProps> = (props: QuestionProps) => {
  const { question } = props;
  return (
    <div>
      <p>Question: {question.title}</p>
      <Table striped bordered>
        <thead>
          <tr>
            <th>answers</th>
            <th className="text-center">correct / incorrect </th>
          </tr>
        </thead>
        <tbody>
          {question.answers.map((answer, i) => (
            <tr key={question.title}>
              <td>{answer.data}</td>
              <td className="text-center">{answer.isCorrect ? <p>&#9989;</p> : <p>&#10060;</p>} </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Question;
