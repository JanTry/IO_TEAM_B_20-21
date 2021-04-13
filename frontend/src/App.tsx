import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Entry from './components/Entry';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import QuizViewer from './components/quizViewer/QuizViewer';
import { QuestionCreatorProvider } from './context/QuestionCreatorContext';
import { UserProvider } from './context/UserContext';

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt');
    config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const App = () => (
  <Router>
    <Switch>
      <UserProvider>
        <Route exact path="/" component={Entry} />
        <Route exact path="/login/lecturer">
          <LoginForm isLecturer />
        </Route>
        <Route exact path="/login/student">
          <LoginForm isLecturer={false} />
        </Route>
        <Route exact path="/register/student" component={RegistrationForm} />
        <Route exact path="/student/dashboard" component={Dashboard} />
        <Route exact path="/lecturer/dashboard" component={Dashboard} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/quiz">
          <QuestionCreatorProvider>
            <QuizViewer />
          </QuestionCreatorProvider>
        </Route>
      </UserProvider>
    </Switch>
  </Router>
);

export default App;
