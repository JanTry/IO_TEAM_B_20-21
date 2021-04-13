/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { useQuestionCreator } from '../../context/QuestionCreatorContext';
import QuestionCreator from './QuestionCreator';

interface QuizViewerProps {
  quizId?: number | undefined;
}

const QuizViewer: React.FunctionComponent<QuizViewerProps> = (props: QuizViewerProps) => {
  const { quizId } = props;
  const { currentQuestion, isCreatingQuestion, clearCurrentQuestion, toggleIsCreatingQuestion } = useQuestionCreator();
  const [questions, setQuestions] = useState();
  const [didQuizUpdate, setDidQuizUpdate] = useState(true);

  useEffect(() => {
    if (quizId !== undefined) {
      // fetch quiz from db && setQuestions(result)
    }
  });

  useEffect(() => {
    if (currentQuestion !== undefined && currentQuestion !== null) {
      // update questins with currentQuestion
      clearCurrentQuestion();
      setDidQuizUpdate(true);
    }
  }, [currentQuestion]);

  const onCreateQuestionClicked = useCallback(() => {
    toggleIsCreatingQuestion();
  }, []);

  const onSaveChangesClicked = useCallback(() => {
    // save changes to db
  }, []);

  const onCancelClicked = useCallback(() => {
    // if quizId undefined exit else view old
  }, []);

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center p-2 bg-light">
      {isCreatingQuestion ? (
        <QuestionCreator />
      ) : (
        <Container className="d-flex flex-column justify-content-between">
          <Button variant="primary" className="my-2 p-2" block onClick={onCreateQuestionClicked}>
            add question
          </Button>
          {didQuizUpdate && (
            <div>
              <Button variant="outline-success" className="p-2" block onClick={onSaveChangesClicked}>
                save changes
              </Button>
              <Button variant="outline-danger" className="p-2" block onClick={onCancelClicked}>
                cancel
              </Button>
            </div>
          )}
        </Container>
      )}
    </Container>
  );
};

QuizViewer.defaultProps = {
  quizId: undefined,
};

export default QuizViewer;
