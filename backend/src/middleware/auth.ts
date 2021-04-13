import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { User } from '../database/models/user';

const publicKey = fs.readFileSync('resources/public.key');

export const authMiddleware = async (req, res, next) => {
  try {
    const prefix = req.headers.authorization.split(' ')[0];
    if (prefix !== 'Bearer') {
      res.status(401).json({
        errors: [{ authentication: 'Invalid request!' }],
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, publicKey) as any;
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(401).json({
        errors: [{ authentication: 'Invalid user!' }],
      });
    }
    res.locals.user = user;
    next();
  } catch {
    return res.status(401).json({
      errors: [{ authentication: 'Invalid request!' }],
    });
  }
};

export const teacherMiddleware = (req, res, next) => {
  if (res.locals.user.role !== 'teacher') {
    res.status(401).json({
      errors: [{ authentication: 'Invalid role!' }],
    });
  }
  next();
};

export const studentMiddleware = (req, res, next) => {
  if (res.locals.user.role !== 'student') {
    res.status(401).json({
      errors: [{ authentication: 'Invalid role!' }],
    });
  }
  next();
};
