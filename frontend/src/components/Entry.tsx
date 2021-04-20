import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

const Entry = () => {
  const { updateLecturer } = useUser();

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center p-2 bg-light">
      <Link to="/login">
        <Button
          variant="outline-primary"
          onClick={() => {
            updateLecturer('true');
            sessionStorage.setItem('isLecturer', 'true');
          }}
          className="m-4 p-5"
        >
          <h2>I am a lecturer</h2>
        </Button>
      </Link>
      <Link to="/login">
        <Button
          variant="outline-success"
          onClick={() => {
            updateLecturer('false');
            sessionStorage.setItem('isLecturer', 'false');
          }}
          className="m-4 p-5"
        >
          <h2>I am a student</h2>
        </Button>
      </Link>
    </Container>
  );
};

export default Entry;
