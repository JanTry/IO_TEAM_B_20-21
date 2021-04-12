/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const QuestionCreator: React.FunctionComponent = () => {
  const [a, seta] = useState();
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default QuestionCreator;
