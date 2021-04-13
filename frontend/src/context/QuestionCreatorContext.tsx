import React, { createContext, useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { QuestionValue } from '../components/quizViewer/Question';

interface QuestionCreatorContextValue {
  currentQuestion: QuestionValue | null;
  isCreatingQuestion: boolean;
  updateCurrentQuestion: (arg0: QuestionValue) => void;
  clearCurrentQuestion: () => void;
  toggleIsCreatingQuestion: () => void;
}

const QuestionCreatorContext = createContext<QuestionCreatorContextValue>({
  currentQuestion: null,
  isCreatingQuestion: false,
  updateCurrentQuestion: () => null,
  clearCurrentQuestion: () => null,
  toggleIsCreatingQuestion: () => null,
});

export const QuestionCreatorProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [currentQuestion, setCurrentQuestion] = useState<QuestionValue | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  const updateCurrentQuestion = useCallback((question: QuestionValue) => {
    setCurrentQuestion(question);
  }, []);

  const clearCurrentQuestion = useCallback(() => {
    setCurrentQuestion(null);
  }, []);

  const toggleIsCreatingQuestion = useCallback(() => {
    setIsCreatingQuestion(!isCreatingQuestion);
  }, []);

  return (
    <QuestionCreatorContext.Provider
      value={{
        currentQuestion,
        isCreatingQuestion,
        updateCurrentQuestion,
        clearCurrentQuestion,
        toggleIsCreatingQuestion,
      }}
    >
      {children}
    </QuestionCreatorContext.Provider>
  );
};

QuestionCreatorProvider.propTypes = {
  children: PropTypes.node,
};

QuestionCreatorProvider.defaultProps = {
  children: null,
};

export const useQuestionCreator = (): QuestionCreatorContextValue => useContext(QuestionCreatorContext);
