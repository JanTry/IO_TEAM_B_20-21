/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useQuestionCreator } from '../../context/QuestionCreatorContext';
import { AnswerValue } from './Question';

const QuestionCreator: React.FunctionComponent = () => {
  const { updateCurrentQuestion, toggleIsCreatingQuestion } = useQuestionCreator();

  const [title, setTitle] = useState<string>();
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
    if (title !== undefined && answers !== undefined) {
      updateCurrentQuestion({ title, answers });
    }
    e.preventDefault();

    toggleIsCreatingQuestion();
  };

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onAnswerChanged = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    if (answers !== undefined) {
      if (e.target.type === 'checkbox') {
        setAnswers([
          ...answers.slice(0, id),
          { ...answers[id], isCorrect: !answers[id].isCorrect },
          ...answers.slice(id + 1),
        ]);
      }
      if (e.target.type === 'text') {
        setAnswers([...answers.slice(0, id), { ...answers[id], data: e.target.value }, ...answers.slice(id + 1)]);
      }
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group onChange={onTitleChanged}>
          <Form.Label>Question title</Form.Label>
          <Form.Control value={title} placeholder="email@example.com" />
        </Form.Group>
        {answers !== undefined &&
          [...answers].map((_, i) => (
            <Form.Group onChange={onAnswerChanged(i)} id={i.toString()}>
              <Form.Label>Answer {i + 1}</Form.Label>
              <Form.Control placeholder="answer" />
              <Form.Check type="checkbox" label="Correct answer" />
            </Form.Group>
          ))}
        <Button variant="primary" onClick={onAddAnswerPressed}>
          Add Answer
        </Button>
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="primary" type="button" onClick={onCancelPressed}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default QuestionCreator;
