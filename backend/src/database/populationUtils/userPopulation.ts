/* eslint-disable no-console */

import faker from 'faker';
import * as bcrypt from 'bcrypt';
import { addUser } from '../collectionsUtils/userUtils';

export const populateUsersCollection = async (n = 10, role = 'student') => {
  const ROUNDS = 10;
  const salt = await bcrypt.genSalt(ROUNDS);
  const password = await bcrypt.hash('password123', salt);

  for (let i = 1; i <= n; i++) {
    addUser({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      password,
      role,
    });
  }
  console.log(n, 'new', `${role}s added to users`);
};
