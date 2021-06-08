import React, { ChangeEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useQuestionCreator } from '../../context/QuestionCreatorContext';
import { AnswerValue } from './Question';

const QuestionCreator: React.FunctionComponent = () => {
  const { updateCurrentQuestion, toggleIsCreatingQuestion } = useQuestionCreator();

  const [title, setTitle] = useState<string>('');
  const [answers, setAnswers] = useState<AnswerValue[]>();

  const onCancelPressed = () => {
    toggleIsCreatingQuestion();
  };

  const onAddAnswerPressed = () => {
    const newAnswer = { data: '', isCorrect: false };
    if (answers === undefined) {
      setAnswers([newAnswer]);
    } else {
      setAnswers([...answers, newAnswer]);
    }
  };

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    if (title !== '' && answers !== undefined) {
      updateCurrentQuestion({ title, answers, points:1 });
    }
    e.preventDefault();
    toggleIsCreatingQuestion();
  };

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onAnswerChanged = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    if (answers !== undefined) {
      if (e.target.type === 'checkbox') {
        setAnswers([
          ...answers.slice(0, index),
          { ...answers[index], isCorrect: !answers[index].isCorrect },
          ...answers.slice(index + 1),
        ]);
      }
      if (e.target.type === 'text') {
        setAnswers([
          ...answers.slice(0, index),
          { ...answers[index], data: e.target.value },
          ...answers.slice(index + 1),
        ]);
      }
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group onChange={onTitleChanged}>
          <Form.Label>Question title</Form.Label>
          <Form.Control placeholder="Enter question title" />
        </Form.Group>
        {answers !== undefined &&
          [...answers].map((_, i) => (
            <Form.Group onChange={onAnswerChanged(i)} key={i.toString()}>
              <Form.Label>Answer {i + 1}</Form.Label>
              <Form.Control placeholder="Enter answer" />
              <Form.Check type="checkbox" label="Correct answer" />
            </Form.Group>
          ))}
        <Button variant="primary" onClick={onAddAnswerPressed} block>
          Add Answer
        </Button>
        <Button variant="outline-success" type="submit" block>
          Save
        </Button>
        <Button variant="outline-danger" type="button" onClick={onCancelPressed} block>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default QuestionCreator;
