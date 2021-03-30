import Entry from './components/Entry';
import LecturerLogin from './components/LecturerLogin';
import StudentLogin from './components/StudentLogin';
import StudentRegistration from './components/StudentRegistration';
import StudentDashboard from './components/StudentDashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Entry} />
        <Route exact path="/login/lecturer" component={LecturerLogin} />
        <Route exact path="/login/student" component={StudentLogin} />
        <Route exact path="/register/student" component={StudentRegistration} />
        <Route exact path="/student/dashboard" component={StudentDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
