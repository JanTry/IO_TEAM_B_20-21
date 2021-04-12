import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Entry from './components/Entry';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import StudentDashboard from './components/StudentDashboard';
import Chat from './components/Chat';
import QuizCreator from './components/QuizCreator';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Entry} />
      <Route exact path="/login/lecturer">
        <LoginForm isLecturer />
      </Route>
      <Route exact path="/login/student">
        <LoginForm isLecturer={false} />
      </Route>
      <Route exact path="/register/student" component={RegistrationForm} />
      <Route exact path="/student/dashboard" component={StudentDashboard} />
      <Route exact path="/student/chat" component={Chat} />
      <Route exact path="/createquiz" component={QuizCreator} />
    </Switch>
  </Router>
);

export default App;
