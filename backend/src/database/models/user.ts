import * as mongoose from 'mongoose';

export interface UserType {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String, 
      required: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
  }
);

export const User = mongoose.model('User', userSchema);
export const UserSchema = userSchema;
