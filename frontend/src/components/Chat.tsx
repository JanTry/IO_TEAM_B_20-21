/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
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
  Table,
  DropdownButton,
  Dropdown,
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
    console.log(user);
    console.log(sessionId);
    console.log(accessCode);

    socket.emit('join', { userID: userId, sessionID: sessionId, accessCode }, (response: any) => {
      if (response.status === 'ok') {
        setConnected(true);
      } else {
        console.error(response.msg);
      }
    });
  }, [history.location.state]);

  useEffect(() => {
    const fetchQuizData = async (id: string) => {
      const responseResult = await axios.post(`${baseUrl}/quizResponse`, { quizId: id });
      setResponseId(responseResult.data.id);

      const result = await axios.get(`${baseUrl}/quiz/questions/${id}`);
      setQuestions(result.data);
      console.log(result.data.questions);
      console.log(result.data.questions[0]);
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
    console.log(event.target.a.value);
    const result = await axios.put(`${baseUrl}/quizResponse`, {
      quizResponseId: responseId,
      quizId,
      questionId: question._id,
      answerId: event.target.a.value,
    });
    console.log(result.data);
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

  const handleAnswerSelect = (event: any) => {
    console.log(event);
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
            <th>{userId}</th>
            <th>{sessionId}</th>
            <th>{accessCode}</th>
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

          <Form onSubmit={handleMessageSubmition}>
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
