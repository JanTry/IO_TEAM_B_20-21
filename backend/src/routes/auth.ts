import express from 'express'
import {body, validationResult, CustomValidator} from 'express-validator'
import {User, UserSchema} from '../database/models/user'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'

const auth = express.Router();

enum Role {
  Teacher = 'teacher',
  Student = 'student',
}

const isValidRole: CustomValidator = (value: Role | string) => {
  return value === Role.Teacher || value === Role.Student
};

const privateKey = fs.readFileSync('resources/private.key');
const publicKey = fs.readFileSync('resources/public.key');

auth.post("/register",
  body('email').isEmail(),
  body('password').isLength({min: 8}),
  body('role').custom(isValidRole),
  async (req, res) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) return res.status(400).json({errors: errors.array()});

    const {email, role} = req.body
    if (await User.findOne({email: req.body.email})) {
      return res.status(400).json({errors: [{email: "Email already exists."}]});
    }

    const ROUNDS = 10;
    const salt = await bcrypt.genSalt(ROUNDS);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({email, password, role});

    const result = user.save((error, doc) => {
      if (error) {
        console.log(error);
        return res.status(400).json({errors: [{email: "Email already exists."}]});
      }
      res.status(200).json({
        success: true,
        id: doc._id,
        token: jwt.sign({role: req.body.role, email: req.body.email}, privateKey, {algorithm: 'RS256'})
      });
    })
  });

auth.post("/login",
  body('email').isEmail(),
  body('password').isLength({min: 8}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    const result = User.findOne({email: req.body.email}, async (err, user) => {
      if (!user) return res.status(400).json({errors: [{user: "This email doesn't match any user."}]});
      if (await bcrypt.compare(req.body.password, user.password)) {
        return res.status(200).json({
          succes: true,
          token: jwt.sign({role: user.role, email: user.email}, privateKey, {algorithm: 'RS256'})
        });
      }
      return res.status(400).json({errors: [{password: "Invalid password."}]});
    });
  });

export default auth;