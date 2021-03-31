import { Link } from 'react-router-dom';

const Entry = () => (
  <div className="container-fluid vh-100 d-flex justify-content-center align-items-center p-2 bg-light">
    <Link to="/login/lecturer">
      <button type="button" className="btn btn-outline-primary m-4 p-5"><h2>I am a lecturer</h2></button>
    </Link>
    <Link to="/login/student">
      <button type="button" className="btn btn-outline-success m-4 p-5"><h2>I am a student</h2></button>
    </Link>
  </div>
);

export default Entry;
