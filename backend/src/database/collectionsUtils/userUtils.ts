/* eslint-disable no-console */

import { User, UserSchema, UserType } from '../models/user';
// var random = require('mongoose-simple-random');

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

