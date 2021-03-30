import { Form, Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

const StudentLogin = () => {
  let history = useHistory();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(event.target.email.value);
    console.log(event.target.password.value);

    // login logic
    
    event.target.email.value = '';
    event.target.password.value = '';

    history.push("/student/dashboard");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      <h1 className="mb-5">hello fellow student!</h1>
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
        <Button variant="primary" type="submit" block className="mb-5">
          sign in
        </Button>
        <Form.Group>
          <Form.Text className="text-muted text-center">
            do not have an account yet?
          </Form.Text>
          <Link to="/register/student">
            <button type="button" className="btn btn-outline-primary btn-block">sign up</button>
          </Link>
        </Form.Group>
      </Form>
    </div>
  );
};

export default StudentLogin;
