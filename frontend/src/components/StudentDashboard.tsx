import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const history = useHistory();
  const [userID, setUserID] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const result = await axios.get(`http://localhost:4000/sessions/validate/${sessionID}/${accessCode}`);
    console.log(result)
    if (result.data) {
      history.push({
        pathname: "/student/chat",
        state: { userID, sessionID, accessCode }
      })
    } else {
      console.error("You shall not pass")
    }
  }

  const createNewSession = async (event: any) => {
    event.preventDefault()
    const result = await axios.post(`http://localhost:4000/sessions/`);
    console.log(result.data)
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="userID">
          <Form.Label>User id</Form.Label>
          <Form.Control value={userID} onChange={e => setUserID(e.target.value)} placeholder="Enter user id" />
        </Form.Group>

        <Form.Group controlId="sessionID">
          <Form.Label>Session id</Form.Label>
          <Form.Control value={sessionID} onChange={e => setSessionID(e.target.value)} placeholder="Enter session id" />
        </Form.Group>

        <Form.Group controlId="userID">
          <Form.Label>Access code</Form.Label>
          <Form.Control value={accessCode} onChange={e => setAccessCode(e.target.value)} placeholder="Enter access code" />
        </Form.Group>

        <Button variant="primary" type="submit" block className="mb-5">
          Enter session
        </Button>

        <Button variant="primary" type="button" onClick={createNewSession} block className="mb-5">
          Create new session (watch dev console)
        </Button>
      </Form>
    </div>
  )
}

export default StudentDashboard;