import axios from 'axios';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useQuestionCreator } from '../../context/QuestionCreatorContext';
import Question, { QuestionValue } from './Question';
import QuestionCreator from './QuestionCreator';

interface QuizViewerProps {
  quizId?: number | undefined;
  toggleQuizCreation: () => void;
}

const QuizViewer: React.FunctionComponent<QuizViewerProps> = (props: QuizViewerProps) => {
  const { quizId, toggleQuizCreation } = props;
  const { currentQuestion, isCreatingQuestion, clearCurrentQuestion, toggleIsCreatingQuestion } = useQuestionCreator();
  const [questions, setQuestions] = useState<QuestionValue[]>();
  const [didQuizUpdate, setDidQuizUpdate] = useState(false);
  const [quizName, setQuizName] = useState('');

  useEffect(() => {
    if (quizId !== undefined) {
      // fetch quiz from db && setQuestions(result)
    }
  });

  useEffect(() => {
    // update questions with currentQuestion
    if (currentQuestion !== undefined && currentQuestion !== null) {
      if (questions !== undefined) {
        setQuestions([...questions, currentQuestion]);
      } else {
        setQuestions([currentQuestion]);
      }
      clearCurrentQuestion();
      setDidQuizUpdate(true);
    }
  }, [currentQuestion]);

  const onCreateQuestionClicked = useCallback(async () => {
    toggleIsCreatingQuestion();
  }, []);

  const onSaveChangesClicked = useCallback(async () => {
    // save changes to db
    await axios.post(`${process.env.REACT_APP_BASE_URL}/quiz`, { quizName, questions });
    toggleQuizCreation();
  }, [quizName, questions]);

  const onCancelClicked = useCallback(() => {
    // if quizId undefined exit else view old
    toggleQuizCreation();
  }, []);

  const onQuizNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center px-5 bg-light">
      <Form onSubmit={() => {}}>
        <Form.Group onChange={onQuizNameChanged}>
          <Form.Label>Quiz name</Form.Label>
          <Form.Control placeholder="Enter quiz name" />
        </Form.Group>
      </Form>
      {questions !== undefined && questions.map((question) => <Question question={question} key={question.title} />)}
      {isCreatingQuestion ? (
        <QuestionCreator />
      ) : (
        <div>
          <Button variant="primary" className="m-2 p-2" size="lg" onClick={onCreateQuestionClicked} block>
            Add question
          </Button>
          {didQuizUpdate && (
            <div>
              <Button variant="outline-success" className="m-2 p-2" onClick={onSaveChangesClicked} block>
                Save changes
              </Button>
              <Button variant="outline-danger" className="m-2 p-2" onClick={onCancelClicked} block>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default QuizViewer;
