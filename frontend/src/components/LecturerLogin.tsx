import { Form, Button } from 'react-bootstrap';

const LecturerLogin = () => {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(event.target.email.value);
    console.log(event.target.password.value);

    // login logic
    
    event.target.email.value = '';
    event.target.password.value = '';
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      <h1 className="mb-5">hello fellow lecturer!</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We will never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit" block>
          sign in
        </Button>
      </Form>
    </div>
  );
};

export default LecturerLogin;
