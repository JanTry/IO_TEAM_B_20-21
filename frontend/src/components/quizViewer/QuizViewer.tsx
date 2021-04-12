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

  useEffect(() => {
    if (currentQuestion !== undefined && currentQuestion !== null) {
      clearCurrentQuestion();
    }
  }, [currentQuestion, clearCurrentQuestion]);

  const onCreateQuestionClicked = useCallback(() => {
    toggleIsCreatingQuestion();
  }, []);

  console.log(quizId);
  const [questions, setQuestions] = useState();
  return (
    <div>
      {isCreatingQuestion ? (
        <QuestionCreator />
      ) : (
        <Button variant="outline-primary" className="m-2 p-2" onClick={onCreateQuestionClicked}>
          <p>add question</p>
        </Button>
      )}
    </div>
  );
};

QuizViewer.defaultProps = {
  quizId: undefined,
};

export default QuizViewer;
