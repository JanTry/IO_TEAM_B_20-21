/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
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
    <div>
      {isCreatingQuestion ? (
        <QuestionCreator />
      ) : (
        <div>
          <Button variant="outline-primary" className="m-2 p-2" onClick={onCreateQuestionClicked}>
            <p>add question</p>
          </Button>
          {didQuizUpdate && (
            <div>
              <Button variant="outline-primary" className="m-2 p-2" onClick={onSaveChangesClicked}>
                <p>save changes</p>
              </Button>
              <Button variant="outline-primary" className="m-2 p-2" onClick={onCancelClicked}>
                <p>cancel</p>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

QuizViewer.defaultProps = {
  quizId: undefined,
};

export default QuizViewer;
