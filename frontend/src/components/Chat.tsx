/* eslint-disable no-underscore-dangle */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
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
  DropdownButton,
  Dropdown,
  Navbar,
  Nav,
} from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const baseUrl = 'http://localhost:4000';

const socket = io.connect(baseUrl);

interface ChatMessage {
  from: string;
  msg: string;
}

interface Question {
  _id: string;
  title: string;
  answers: Array<{
    _id: string;
    data: string;
  }>;
}

const Chat = () => {
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as string[]);
  const [connected, setConnected] = useState(false);

  const [responseId, setResponseId] = useState('');

  const [quizId, setQuizId] = useState('');
  const [quizIds, setQuizIds] = useState([] as string[]);

  const [question, setQuestion] = useState<Question>({ _id: '', title: '', answers: [] });
  const [questions, setQuestions] = useState<Question[]>([]);

  const { user, userId, sessionId, accessCode } = useUser();

  useEffect(() => {
    socket.emit('join', { userID: userId, sessionID: sessionId, accessCode }, (response: any) => {
      if (response.status === 'ok') {
        setConnected(true);
      }
    });
  }, [history.location.state]);

  useEffect(() => {
    const fetchQuizData = async (id: string) => {
      const responseResult = await axios.post(`${baseUrl}/quizResponse`, { quizId: id });
      setResponseId(responseResult.data.id);

      const result = await axios.get(`${baseUrl}/quiz/questions/${id}`);
      setQuestions(result.data);
      setQuestion(result.data.questions[0]);
    };

    socket.on('start-quiz', (data: any) => {
      if (user && user.role === 'student') {
        setQuizId(data.quizId);
        fetchQuizData(data.quizId);
      }
    });

    socket.on('end-quiz', () => {
      setQuestions([]);
      setQuestion({ _id: '', title: '', answers: [] });
    });
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${baseUrl}/quiz`);
      if (result.data) {
        setQuizIds(result.data);
      }
    };

    if (user && user.role === 'teacher') {
      fetchData();
    }
  }, [user]);

  const handleMessageSubmition = (event: any) => {
    event.preventDefault();

    if (event.target.message.value) {
      socket.emit('chat-message', event.target.message.value);
      event.target.message.value = '';
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await axios.put(`${baseUrl}/quizResponse`, {
      quizResponseId: responseId,
      quizId,
      questionId: question._id,
      answerId: event.target.a.value,
    });
    if (questions.length > 1) {
      setQuestion(questions[1]);
      setQuestions(questions.slice(1));
    } else {
      setQuestion({ _id: '', title: '', answers: [] });
      setQuestions([]);
    }
  };

  const handleQuizIdSelect = (event: any) => {
    setQuizId(event);
  };

  const handleQuizStart = () => {
    socket.emit('start-quiz', quizId);
  };

  const handleQuizEnd = () => {
    socket.emit('end-quiz', 'koniec');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    history.push('/');
  };

  return (
    <Container fluid className="px-0">
      <Navbar bg="light" expand="lg" fixed="top">
        <Navbar.Brand>Studentoaktywizator 3000</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Navbar.Text className="mt-1 mx-2">
              Session ID: <b>{sessionId}</b>
            </Navbar.Text>
            <Navbar.Text className="mt-1 mx-2">
              Access code: <b>{accessCode}</b>
            </Navbar.Text>
          </Nav>
          <Navbar.Text className="mt-1 mx-2">
            Signed in as: <b>{userId}</b>
          </Navbar.Text>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <Row className="my-5">
        <Col className="bg-secondary">
          <ListGroup className="p-4 mx-0">
            {messages.map((msg) => (
              <ListGroup.Item className="pb-2">{msg}</ListGroup.Item>
            ))}
          </ListGroup>

          <Form onSubmit={handleMessageSubmition} className="fixed-bottom w-50 p-2 bg-secondary">
            <InputGroup>
              <FormControl id="message" placeholder="enter message" />
              <InputGroup.Append>
                <Button type="submit" variant="success">
                  send message
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Col>
        <Col className="vh-100">
          {user && user.role === 'student' ? (
            <Container fluid className="vh-100 d-flex flex-column justify-content-center px-5">
              <Form onSubmit={handleSubmit}>
                <h3>{question.title}</h3>
                <Form.Group as={Row}>
                  <Col>
                    {question.answers.map((option: any) => (
                      <Form.Check type="radio" name="a" value={option._id} label={option.data} />
                    ))}
                  </Col>
                </Form.Group>
                {question && question.answers.length > 0 ? (
                  <Button variant="primary" type="submit" block>
                    submit
                  </Button>
                ) : null}
              </Form>
            </Container>
          ) : (
            <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center px-5">
              <DropdownButton className="m-4" id="dropdown-basic-button" title="wybierz quiz">
                {quizIds.map((id) => (
                  <Dropdown.Item onSelect={handleQuizIdSelect} eventKey={id}>
                    {id}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              <Button disabled={!quizId} className="m-4" variant="primary" onClick={handleQuizStart} block>
                Start quiz
              </Button>
              <Button disabled={!quizId} className="m-4" variant="primary" onClick={handleQuizEnd} block>
                End quiz
              </Button>
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
