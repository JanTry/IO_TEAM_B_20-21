/* eslint-disable no-console */

import { User, UserType } from '../models/user';

export const addUser = async (userData: UserType) => {
  return new User(userData).save();
};
export const findOneUser = async (userData: UserType) => {
  return User.findOne(userData);
};
export const findUsers = async (userData: UserType) => {
  return User.find(userData);
};
export const deleteUser = async (userData: UserType) => {
  return User.deleteOne(userData);
};
export const deleteManyUsers = async (userData: UserType) => {
  return User.deleteMany(userData);
};

export const printUsers = async (userData: UserType) => {
  console.log(await findUsers(userData));
};

export const printAllUsers = async () => {
  console.log(User.find({}));
};

export const clearUsersCollection = async () => {
  return (await User.deleteMany({})).deletedCount;
};

export const populateUsersCollection = async (n = 10) => {
  for (let i = 1; i <= n; i++) {
    addUser({
      firstName: `FIRSTNAME_${i}`,
      lastName: `LASTNAME_${i}`,
      email: `EMAIL${i}`,
      password: `PASSWORD${i}`,
      role: `ROLE${i}`,
    });
  }
  console.log(n, ' new users added to users');
};
