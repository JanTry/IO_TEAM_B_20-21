import * as mongoose from 'mongoose';

export interface UserType {
  name: string;
  surname: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: false,
    },
  },
  {
    collection: 'users',
  }
);

export const User = mongoose.model('User', userSchema);
