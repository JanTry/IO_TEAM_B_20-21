/* eslint-disable no-underscore-dangle */
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const sessionUrlFormat = (sessionId: String, accessCode: String) =>
  `${process.env.REACT_APP_FRONT_URL}/session-id/${sessionId}/access-code/${accessCode}`;

const Dashboard = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const { user, updateUsername, updateSessionId, updateAccessCode, updateSessionUrl } = useUser();

  useEffect(() => {
    setUsername(`${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`);
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/session/validate/${sessionId}/${accessCode}`);
    if (result.data) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('sessionId', sessionId);
      sessionStorage.setItem('accessCode', accessCode);
      sessionStorage.setItem('sessionUrl', sessionUrl);
      updateUsername(username);
      updateSessionId(sessionId);
      updateSessionUrl(sessionUrl);
      updateAccessCode(accessCode);
      history.push('/chat');
    } else {
      console.error('You shall not pass');
    }
  };

  const createNewSession = async (event: any) => {
    event.preventDefault();

    const result: any = await axios.post(`${process.env.REACT_APP_BASE_URL}/session`);

    setSessionId(result.data._id);
    setAccessCode(result.data.accessCode);
    setSessionUrl(sessionUrlFormat(result.data._id, result.data.accessCode));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    history.push('/');
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center px-5 p-2 bg-light">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="userID">
          <Form.Label>User id</Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter user id"
            disabled
          />
        </Form.Group>

        <Form.Group controlId="sessionID">
          <Form.Label>Session id</Form.Label>
          <Form.Control
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter session id"
          />
        </Form.Group>

        <Form.Group controlId="accessCode">
          <Form.Label>Access code</Form.Label>
          <Form.Control
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
          />
        </Form.Group>

        <Form.Group controlId="sessionUrl">
          <Form.Label>Link to the session:</Form.Label>
          <Form.Control value={sessionUrl} onChange={(e) => setSessionUrl(e.target.value)} placeholder="" />
        </Form.Group>

        <Button variant="primary" type="submit" block className="mb-5">
          Enter session
        </Button>

        {(user && user.role) === 'teacher' ? (
          <Button variant="primary" type="button" onClick={createNewSession} block className="mb-5">
            Create new session
          </Button>
        ) : null}

        <Button variant="danger" type="button" onClick={handleLogout} block className="mb-5">
          Log out
        </Button>
      </Form>
    </Container>
  );
};

export default Dashboard;
