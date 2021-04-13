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
        <Form.Group controlId="question">
          <Form.Label>Question</Form.Label>
          <Form.Control type="text" placeholder="Enter question" />
        </Form.Group>

        <Form.Group controlId="a-answer">
          <Form.Label>Answer a</Form.Label>
          <Form.Control type="text" placeholder="Enter answer a" />
          <Form.Group controlId="formBasicCheckboxA">
            <Form.Check type="checkbox" label="Correct answer" />
          </Form.Group>
        </Form.Group>

        <Form.Group controlId="b-answer">
          <Form.Label>Answer b</Form.Label>
          <Form.Control type="text" placeholder="Enter answer b" />
          <Form.Group controlId="formBasicCheckboxB">
            <Form.Check type="checkbox" label="Correct answer" />
          </Form.Group>
        </Form.Group>

        <Form.Group controlId="c-answer">
          <Form.Label>Answer c</Form.Label>
          <Form.Control type="text" placeholder="Enter answer c" />
          <Form.Group controlId="formBasicCheckboxC">
            <Form.Check type="checkbox" label="Correct answer" />
          </Form.Group>
        </Form.Group>

        <Form.Group controlId="d-answer">
          <Form.Label>Answer d</Form.Label>
          <Form.Control type="text" placeholder="Enter answer d" />
          <Form.Group controlId="formBasicCheckboxD">
            <Form.Check type="checkbox" label="Correct answer" />
          </Form.Group>
        </Form.Group>

        <Button variant="outline-success" type="submit" block onClick={onSavePressed}>
          Save
        </Button>
        <Button variant="outline-danger" type="submit" block onClick={onCancelPressed}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default QuestionCreator;
