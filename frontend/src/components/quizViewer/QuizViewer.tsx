/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useQuestionCreator } from '../../context/QuestionCreatorContext';
import Question, { QuestionValue } from './Question';
import QuestionCreator from './QuestionCreator';

interface QuizViewerProps {
  quizId?: number | undefined;
}

const QuizViewer: React.FunctionComponent<QuizViewerProps> = (props: QuizViewerProps) => {
  const { quizId } = props;
  const { currentQuestion, isCreatingQuestion, clearCurrentQuestion, toggleIsCreatingQuestion } = useQuestionCreator();
  const [questions, setQuestions] = useState<QuestionValue[]>();
  const [didQuizUpdate, setDidQuizUpdate] = useState(false);

  useEffect(() => {
    if (quizId !== undefined) {
      // fetch quiz from db && setQuestions(result)
    }
  });

  useEffect(() => {
    // update questions with currentQuestion
    if (currentQuestion !== undefined && currentQuestion !== null) {
      if (questions !== undefined) {
        setQuestions([...questions]);
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

export default QuizViewer;
