import { Form, Button, Container } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import registerService from '../services/register';

const RegistrationForm = () => {
  const history = useHistory();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const user = await registerService.register({
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        email: event.target.email.value,
        password: event.target.password.value,
        role: 'student',
      });

      if (user) {
        history.push('/login');
      }

      event.target.firstName.value = '';
      event.target.lastName.value = '';
      event.target.email.value = '';
      event.target.password.value = '';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      <h1 className="mb-5">hello fellow student!</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>Firstname</Form.Label>
          <Form.Control type="text" placeholder="Enter your firstname" />
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Lastname</Form.Label>
          <Form.Control type="text" placeholder="Enter your lastname" />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Button variant="primary" type="submit" block className="mb-5">
          sign up
        </Button>

        <Form.Group>
          <Form.Text className="text-muted text-center">already have an account?</Form.Text>
          <Link to="/login">
            <button type="button" className="btn btn-outline-primary btn-block">
              sign in
            </button>
          </Link>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default RegistrationForm;
