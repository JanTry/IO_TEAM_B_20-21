import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Entry = () => (
  <Container fluid className="vh-100 d-flex justify-content-center align-items-center p-2 bg-light">
    <Link to="/login/lecturer">
      <Button variant="outline-primary" className="m-4 p-5">
        <h2>I am a lecturer</h2>
      </Button>
    </Link>
    <Link to="/login/student">
      <Button variant="outline-success" className="m-4 p-5">
        <h2>I am a student</h2>
      </Button>
    </Link>
    <Link to="/student/dashboard">
      <Button variant="outline-dark" className="m-4 p-5">
        <h2>I wanna dance with somebody</h2>
      </Button>
    </Link>
    <Link to="/quiz">
      <Button variant="outline-dark" className="m-4 p-5">
        <h2>quiz</h2>
      </Button>
    </Link>
  </Container>
);

export default Entry;
