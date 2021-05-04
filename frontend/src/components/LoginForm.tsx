/* eslint-disable no-unused-expressions */
import React from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import jwt from 'jwt-decode';
import loginService from '../services/login';
import { useUser } from '../context/UserContext';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const LoginForm = () => {
  const { isLecturer, updateUser } = useUser();

  const history = useHistory();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await loginService.login({
        email: event.target.email.value,
        password: event.target.password.value,
      });

      const decodedUser: User = jwt(response.token);

      updateUser(decodedUser);

      sessionStorage.setItem('jwt', response.token);
      sessionStorage.setItem('email', decodedUser.email);
      sessionStorage.setItem('role', decodedUser.role);
      sessionStorage.setItem('firstName', decodedUser.firstName);
      sessionStorage.setItem('lastName', decodedUser.lastName);

      history.push('/dashboard');

      event.target.email.value = '';
      event.target.password.value = '';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      <h1 className="mb-5">hello fellow {isLecturer === 'true' ? 'lecturer' : 'student'}!</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">We will never share your email with anyone else.</Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit" block>
          sign in
        </Button>
        {isLecturer === 'false' ? (
          <Form.Group className="mt-5">
            <Form.Text className="text-muted text-center">do not have an account yet?</Form.Text>
            <Link to="/register">
              <button type="button" className="btn btn-outline-primary btn-block">
                sign up
              </button>
            </Link>
          </Form.Group>
        ) : null}
      </Form>
    </Container>
  );
};

export const SessionLoginForm = () => {
  const { sessionId, accessCode } = useParams<{ sessionId: string; accessCode: string }>();
  const { user, updateUserId, updateSessionId, updateAccessCode, isLecturer, updateUser } = useUser();

  const history = useHistory();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await loginService.login({
        email: event.target.email.value,
        password: event.target.password.value,
      });

      const decodedUser: User = jwt(response.token);
      updateUser(decodedUser);
      sessionStorage.setItem('jwt', response.token);
      sessionStorage.setItem('email', decodedUser.email);
      sessionStorage.setItem('role', decodedUser.role);
      sessionStorage.setItem('firstName', decodedUser.firstName);
      sessionStorage.setItem('lastName', decodedUser.lastName);
      sessionStorage.setItem('sessionId', sessionId);
      sessionStorage.setItem('accessCode', accessCode);
      updateUserId(`${decodedUser.firstName} ${decodedUser.lastName}`);
      updateSessionId(sessionId);
      updateAccessCode(accessCode);
      history.push('/chat');

      event.target.email.value = '';
      event.target.password.value = '';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      <h1 className="mb-5">hello fellow {isLecturer === 'true' ? 'lecturer' : 'student'}!</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">We will never share your email with anyone else.</Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit" block>
          sign in
        </Button>
        {isLecturer === 'false' ? (
          <Form.Group className="mt-5">
            <Form.Text className="text-muted text-center">do not have an account yet?</Form.Text>
            <Link to="/register">
              <button type="button" className="btn btn-outline-primary btn-block">
                sign up
              </button>
            </Link>
          </Form.Group>
        ) : null}
      </Form>
    </Container>
  );
};
