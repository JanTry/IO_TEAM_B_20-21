import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { Button, ListGroup, Container, InputGroup, Form, FormControl, Table } from 'react-bootstrap';

const socket = io.connect('http://localhost:4000');

interface ChatMessage {
  from: string;
  msg: string;
}

const Chat = () => {
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as string[]);
  const [userID, setUserID] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const { currentUserId, currentSessionID, currentAccessCode } = history.location.state as { [key: string]: string };
    setUserID(currentUserId);
    setSessionID(currentSessionID);
    setAccessCode(currentAccessCode);

    socket.emit('join', { userID, sessionID, accessCode }, (response: any) => {
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

  return (
    <div>
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
            <th>{userID}</th>
            <th>{sessionID}</th>
            <th>{accessCode}</th>
            <th>{connected ? 'yes' : 'no'}</th>
          </tr>
        </tbody>
      </Table>

      <ListGroup>
        {messages.map((msg) => (
          <ListGroup.Item className="pb-2">{msg}</ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={handleSubmit}>
        <Container fluid className="fixed-bottom p-2 bg-light">
          <InputGroup>
            <FormControl id="message" placeholder="enter message" />
            <InputGroup.Append>
              <Button type="submit" variant="success">
                send message
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Container>
      </Form>
    </div>
  );
};

export default Chat;
