/* eslint-disable no-console */

import * as bcrypt from 'bcrypt';
import { populateUsersCollection } from './populationUtils/userPopulation';
import { populateMessagesCollection } from './populationUtils/messagePopulation';
import { populateQuizCollection } from './populationUtils/quizPopulation';
import { populateSessionsCollection } from './populationUtils/sessionPopulation';
import { populateQuizResponseCollection } from './populationUtils/quizResponsePopulation';
import { addUser } from './collectionsUtils/userUtils';

export const populateDatabase = async () => {
  console.log('Populating database:');
  await populateUsersCollection(5, 'teacher');
  await populateUsersCollection(300, 'student');
  await populateMessagesCollection(1000);
  await populateQuizCollection(30);
  await populateSessionsCollection(20);
  await populateQuizResponseCollection(40, 20, 50);
  console.log('Database populated');
};

export const createSampleUsers = async (teacherNumber = 2, studentNumber = 2) => {
  const ROUNDS = 10;
  const salt = await bcrypt.genSalt(ROUNDS);
  const password = await bcrypt.hash('password123', salt);
  console.log('Creating sample teachers:');
  for (let i = 1; i <= teacherNumber; i++) {
    console.log(
      `\nNEW TEACHER:\nfirstName: Teacher\nlastName: AGH_${i}\nemail: teacher_01@agh.edu.pl\npassword: password123\n`
    );
    addUser({
      firstName: 'Teacher',
      lastName: `AGH_${i}`,
      email: `teacher_${i}@agh.edu.pl`,
      password,
      role: 'teacher',
    });
  }
  console.log('Creating sample students:');
  for (let i = 1; i <= studentNumber; i++) {
    console.log(
      `\nNEW STUDENT:\nfirstName: Student\nlastName: AGH_${i}\nemail: student_${i}@student.agh.edu.pl\npassword: password123\n`
    );
    addUser({
      firstName: 'Student',
      lastName: `AGH_${i}`,
      email: `student_${i}@student.agh.edu.pl`,
      password,
      role: 'student',
    });
  }
};
