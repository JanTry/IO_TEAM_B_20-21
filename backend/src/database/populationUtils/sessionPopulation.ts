/* eslint-disable no-console */

import faker from 'faker';
import { addSession } from '../collectionsUtils/sessionUtils';

export const populateSessionsCollection = async (n = 10) => {
  for (let i = 1; i <= n; i++) {
    addSession({
      accessCode: faker.address.zipCode(),
      online: Boolean(Math.round(Math.random())),
    });
  }
  console.log(n, 'new sessions added to sessions');
};
