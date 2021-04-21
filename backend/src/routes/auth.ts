import express from 'express';
import { body, CustomValidator, validationResult } from 'express-validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { User } from '../database/models/user';

export const authRoutes = express.Router();

enum Role {
  Teacher = 'teacher',
  Student = 'student',
}

const isValidRole: CustomValidator = (value: Role | string) => {
  return value === Role.Teacher || value === Role.Student;
};

const privateKey = fs.readFileSync('resources/private.key');

authRoutes.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').isLength({ min: 2 }),
  body('lastName').isLength({ min: 2 }),
  body('role').custom(isValidRole),
  async (req, res) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, role, firstName, lastName } = req.body;
    if (await User.findOne({ email: req.body.email })) {
      return res.status(400).json({ errors: [{ email: 'Email already exists.' }] });
    }

    const ROUNDS = 10;
    const salt = await bcrypt.genSalt(ROUNDS);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({ email, password, role, firstName, lastName });

    user.save((error, doc) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(400).json({ errors: [{ email: 'Email already exists.' }] });
      }
      res.status(200).json({
        success: true,
        id: doc._id,
        token: jwt.sign({ role: req.body.role, email: req.body.email }, privateKey, { algorithm: 'RS256' }),
      });
    });
  }
);

authRoutes.post('/login', body('email').isEmail(), body('password').isLength({ min: 8 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  User.findOne({ email: req.body.email }, async (err, user) => {
    if (!user) return res.status(400).json({ errors: [{ user: "This email doesn't match any user." }] });
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(200).json({
        success: true,
        token: jwt.sign(
          { role: user.role, email: user.email, firstName: user.firstName, lastName: user.lastName },
          privateKey,
          { algorithm: 'RS256' }
        ),
      });
    }
    return res.status(400).json({ errors: [{ password: 'Invalid password.' }] });
  });
});
