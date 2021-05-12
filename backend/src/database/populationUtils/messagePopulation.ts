/* eslint-disable no-console */
/* eslint-disable func-names */

import faker from 'faker';
import { User } from '../models/user';
import { addMessage } from '../collectionsUtils/messageUtils';

export const populateMessagesCollection = async (n = 10) => {
  for (let i = 1; i <= n; i++) {
    User.count().exec(function (err1, count) {
      const random = Math.floor(Math.random() * count);
      User.findOne()
        .skip(random)
        .exec(function (err2, result) {
          addMessage({
            senderID: result._id,
            text: faker.lorem.words(30),
          });
        });
    });
  }
  console.log(n, 'new messages added to messages');
};
