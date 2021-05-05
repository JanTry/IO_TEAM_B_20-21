/* eslint-disable no-console */

import { populateUsersCollection } from './populationUtils/userPopulation';
import { populateMessagesCollection } from './populationUtils/messagePopulation';
import { populateQuizCollection } from './populationUtils/quizPopulation';
import { populateSessionsCollection } from './populationUtils/sessionPopulation';
import { populateQuizResponseCollection } from './populationUtils/quizResponsePopulation';

export const populateDatabase = () => {
  console.log('Populating database:');
  populateUsersCollection(5, 'teacher');
  populateUsersCollection(300, 'student');
  populateMessagesCollection(1000);
  populateQuizCollection(30);
  populateSessionsCollection(20);
  populateQuizResponseCollection(40, 20, 50);
  console.log('Database populated');
};
