/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
import QuizViewer from './quizViewer/QuizViewer';

const socket = io.connect(process.env.REACT_APP_BASE_URL!);

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

interface Quiz {
  id: string;
  name: string;
  questions: Number;
}

const Chat = () => {
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as string[]);
  const [connected, setConnected] = useState(false);

  const [responseId, setResponseId] = useState('');

  const [quizId, setQuizId] = useState('');
  const [quizes, setQuizes] = useState([] as Quiz[]);
  const [chosenQuiz, setChosenQuiz] = useState('');
  const [quizStatus, setQuizStatus] = useState('');
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  const [question, setQuestion] = useState<Question>({ _id: '', title: '', answers: [] });
  const [questions, setQuestions] = useState<Question[]>([]);

  const [quizMessage, setQuizMessage] = useState('');

  const { user, username, sessionId, accessCode, sessionUrl } = useUser();

  useEffect(() => {
    if (user) {
      socket.emit('join', { userId: username, sessionId }, (response: any) => {
        if (response.status === 'ok') {
          setConnected(true);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchQuizData = async (id: string) => {
        const responseResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/quizResponse`, {
          quizId: id,
          sessionId,
        });
        setResponseId(responseResult.data.id);
        sessionStorage.setItem('responseId', responseResult.data.id);

        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/questions/${id}`);
        setQuestions(result.data);
        setQuestion(result.data[0]);
      };

      socket.on('start-quiz', (data: any) => {
        if (user.role === 'student') {
          setQuizId(data.quizId);
          fetchQuizData(data.quizId);
          setQuizMessage('');
        }
      });

      const fetchQuizResponse = async () => {
        const resId = sessionStorage.getItem('responseId');

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/quizResponse/points/${resId}`);

        sessionStorage.setItem('points', response.data.points);
      };

      socket.on('end-quiz', async () => {
        setQuestions([]);
        setQuestion({ _id: '', title: '', answers: [] });
        await fetchQuizResponse();

        setQuizMessage(`Quiz ended with ${sessionStorage.getItem('points')} points`);
      });
    }
  }, [user]);

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
      const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz`);
      if (result.data) {
        setQuizes(result.data);
      }
    };

    if (user && user.role === 'teacher') {
      fetchData();
    }
  }, [user, isCreatingQuiz]);

  const handleMessageSubmition = (event: any) => {
    event.preventDefault();

    if (event.target.message.value) {
      socket.emit('chat-message', event.target.message.value);
      event.target.message.value = '';
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = {
      quizResponseId: responseId,
      quizId,
      questionId: question._id,
      answerId: event.target.a.value,
    };
    await axios.put(`${process.env.REACT_APP_BASE_URL}/quizResponse`, data);
    if (questions.length > 1) {
      setQuestion(questions[1]);
      setQuestions(questions.slice(1));
    } else {
      setQuestion({ _id: '', title: '', answers: [] });
      setQuestions([]);
      setQuizMessage('You have provided answers for all questions - waiting for teacher to end the test...');
    }
  };

  const handleQuizIdSelect = (event: any) => {
    setQuizId(event);
    setQuizStatus('not yet started');
    const filteredQuiz = quizes.find((quiz) => quiz.id === event);
    if (filteredQuiz) {
      setChosenQuiz(filteredQuiz.name);
    }
  };

  const handleQuizStart = () => {
    socket.emit('start-quiz', quizId);
    setQuizStatus('started');
  };

  const handleQuizEnd = () => {
    socket.emit('end-quiz', quizId);
    setQuizStatus('ended');
  };

  const handleQuizCreation = () => {
    setIsCreatingQuiz(!isCreatingQuiz);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    history.push('/');
  };

  const TeacherPanel = () => {
    if (isCreatingQuiz === true) {
      return (
        <div>
          <QuizViewer toggleQuizCreation={() => setIsCreatingQuiz(false)} />
          <Button className="m-4" variant="primary" onClick={handleQuizCreation} block>
            Cancel quiz creation
          </Button>
        </div>
      );
    }
    return (
      <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center px-5">
        {quizId !== '' ? (
          <div>
            <h4>
              <b>Chosen quiz name: </b>
              {chosenQuiz}
            </h4>
            <h4>
              <b>Quiz status: </b>
              {quizStatus}
            </h4>
          </div>
        ) : null}
        <DropdownButton className="m-4" id="dropdown-basic-button" title="Choose quiz">
          {quizes.map((quiz) => (
            <Dropdown.Item onSelect={handleQuizIdSelect} eventKey={quiz.id}>
              {quiz.name} - number of questions: {quiz.questions}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Button className="m-4" variant="primary" onClick={handleQuizCreation} block>
          Create new quiz
        </Button>
        <Button disabled={!quizId} className="m-4" variant="success" onClick={handleQuizStart} block>
          Start quiz
        </Button>
        <Button disabled={!quizId} className="m-4" variant="danger" onClick={handleQuizEnd} block>
          End quiz
        </Button>
      </Container>
    );
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
            {sessionUrl ? (
              <Navbar.Text className="mt-1 mx-2">
                Link: <b>{sessionUrl}</b>
              </Navbar.Text>
            ) : null}
          </Nav>
          <Navbar.Text className="mt-1 mx-2">
            Signed in as: <b>{username}</b>
          </Navbar.Text>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <Row className="my-5">
        <Col className="bg-secondary">
          <ListGroup className="p-4 mx-0">
            {messages.map((msg, i) => (
              <ListGroup.Item className="pb-2" eventKey={String(i)}>
                {msg}
              </ListGroup.Item>
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
                <h3>{quizMessage}</h3>
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
            <TeacherPanel />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
