import { User, UserType } from '../models/user';
import { addUser } from '../collectionsUtils/userUtils';
import faker from 'faker';

export const populateUsersCollection = async (n = 10, role = "student") => {
    for (let i = 1; i <= n; i++) {
      addUser({
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(10),
        role: role,
      });
    }
    console.log(n, 'new',role+'s added to users');
  };
  