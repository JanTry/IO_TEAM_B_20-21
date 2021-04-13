import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import {
  Button,
  ListGroup,
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  FormControl,
  Table,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const socket = io.connect('http://localhost:4000');

interface ChatMessage {
  from: string;
  msg: string;
}

const Chat = () => {
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as string[]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [currentAccessCode, setCurrentAccessCode] = useState('');
  const [connected, setConnected] = useState(false);

  const { user, updateUserId, updateSessionId, updateAccessCode } = useUser();

  useEffect(() => {
    console.log(history.location.state);
    const { userId, sessionId, accessCode } = history.location.state as { [key: string]: string };
    setCurrentUserId(userId);
    setCurrentSessionId(sessionId);
    setCurrentAccessCode(accessCode);

    updateUserId(currentUserId);
    updateSessionId(currentSessionId);
    updateAccessCode(currentAccessCode);

    socket.emit('join', { userID: userId, sessionID: sessionId, accessCode }, (response: any) => {
      if (response.status === 'ok') {
        setConnected(true);
      } else {
        console.error(response.msg);
      }
    });
  }, [history.location.state]);

  useEffect(() => {
    socket.on('chat-message', ({ from, msg }: ChatMessage) => {
      setMessage(`${from}: ${msg}`);
    });
  }, [message]);

  useEffect(() => {
    if (message !== '') {
      setMessages(messages.concat(message));
    }
  }, [message]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (event.target.message.value) {
      socket.emit('chat-message', event.target.message.value);
      event.target.message.value = '';
    }
  };

  const quizzes = ['quiz 1', 'quiz 2', 'quiz 3', 'quiz 4', 'quiz 5', 'quiz 6'];

  const question = {
    data: 'Treść Pytania',
    answers: [
      { id: 'a)', ans: 'odpowiedź 1' },
      { id: 'b)', ans: 'odpowiedź 2' },
      { id: 'c)', ans: 'odpowiedź 3' },
      { id: 'd)', ans: 'odpowiedź 4' },
    ],
  };

  return (
    <Container fluid>
      <Table className="sticky-top table-dark text-center">
        <thead>
          <tr>
            <th>userID</th>
            <th>sessionID</th>
            <th>accessCode</th>
            <th>connected</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{currentUserId}</th>
            <th>{currentSessionId}</th>
            <th>{currentAccessCode}</th>
            <th>{connected ? 'yes' : 'no'}</th>
          </tr>
        </tbody>
      </Table>
      <Row>
        <Col className="m-2 vh-100">
          <ListGroup>
            {messages.map((msg) => (
              <ListGroup.Item className="pb-2">{msg}</ListGroup.Item>
            ))}
          </ListGroup>

          <Form onSubmit={handleSubmit}>
            <div className="fixed-bottom w-50 p-2 bg-dark">
              <InputGroup>
                <FormControl id="message" placeholder="enter message" />
                <InputGroup.Append>
                  <Button type="submit" variant="success">
                    send message
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          </Form>
        </Col>
        <Col className="p-2 vh-100">
          {user && user.role === 'student' ? (
            <Container fluid className="vh-100 d-flex flex-column justify-content-center px-5">
              <Form onSubmit={handleSubmit}>
                <h3>{question.data}</h3>
                <Form.Group as={Row}>
                  <Col>
                    {question.answers.map((option) => (
                      <Form.Check label={option.ans} />
                    ))}
                  </Col>
                </Form.Group>
                <Button variant="primary" type="submit" block>
                  submit
                </Button>
              </Form>
            </Container>
          ) : (
            <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center px-5">
              <DropdownButton className="m-4" id="dropdown-basic-button" title="wybierz quiz">
                {quizzes.map((quiz) => (
                  <Dropdown.Item>{quiz}</Dropdown.Item>
                ))}
              </DropdownButton>

              <Button className="m-4" variant="primary" onClick={() => console.log('brand new quiz')} block>
                nowy quiz
              </Button>
              <Button className="m-4" variant="primary" onClick={() => console.log('koniec imprezy robaki')} block>
                zatrzymaj quiz
              </Button>
              <Button className="m-4" variant="primary" onClick={() => console.log('lecimy nieśpimy')} block>
                następne pytanie
              </Button>
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
