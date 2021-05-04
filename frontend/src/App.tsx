import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Entry from './components/Entry';
import { LoginForm, SessionLoginForm } from './components/LoginForm';
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
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/session-id/:sessionId/access-code/:accessCode" component={SessionLoginForm} />
        <Route exact path="/register" component={RegistrationForm} />
        <Route exact path="/dashboard" component={Dashboard} />
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
