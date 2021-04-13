/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useQuestionCreator } from '../../context/QuestionCreatorContext';

const QuestionCreator: React.FunctionComponent = () => {
  const { currentQuestion, isCreatingQuestion, clearCurrentQuestion, toggleIsCreatingQuestion } = useQuestionCreator();

  const onSavePressed = useCallback(() => {
    toggleIsCreatingQuestion();
  }, []);

  const onCancelPressed = useCallback(() => {
    toggleIsCreatingQuestion();
  }, []);

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Answer</Form.Label>
          <Form.Control type="password" placeholder="Answer" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Correct answer" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={onSavePressed}>
          Save
        </Button>
        <Button variant="primary" type="submit" onClick={onCancelPressed}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default QuestionCreator;
