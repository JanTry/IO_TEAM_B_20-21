/* eslint-disable no-console */

import faker from 'faker';
import { addUser } from '../collectionsUtils/userUtils';

export const populateUsersCollection = async (n = 10, role = 'student') => {
  for (let i = 1; i <= n; i++) {
    addUser({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(10),
      role,
    });
  }
  console.log(n, 'new', `${role}s added to users`);
};
