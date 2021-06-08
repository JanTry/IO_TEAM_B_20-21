import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { GuardProvider, GuardedRoute, GuardFunction } from 'react-router-guards';
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

const authGuard: GuardFunction = (to, from, next) => {
  const token = sessionStorage.getItem('jwt');
  if (token) {
    next();
  } else {
    next.redirect('/');
  }
};

const ChatWrapper = () => (
  <QuestionCreatorProvider>
    <Chat />
  </QuestionCreatorProvider>
);

const App = () => (
  <Router>
    <GuardProvider guards={[authGuard]}>
      <UserProvider>
        <Switch>
          <Route exact path="/" component={Entry} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/register" component={RegistrationForm} />
          <Route exact path="/session-id/:sessionId/access-code/:accessCode" component={SessionLoginForm} />
          <GuardedRoute exact path="/dashboard" component={Dashboard} />
          <GuardedRoute exact path="/chat" component={ChatWrapper} />
          <GuardedRoute exact path="/quiz">
            <QuestionCreatorProvider>
              <QuizViewer toggleQuizCreation={() => { }} />
            </QuestionCreatorProvider>
          </GuardedRoute>
        </Switch>
      </UserProvider>
    </GuardProvider>
  </Router>
);

export default App;
