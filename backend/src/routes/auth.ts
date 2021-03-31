import express from 'express'
import { body, validationResult, CustomValidator } from 'express-validator'
import {User, UserSchema} from '../database/models/user'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'

const auth = express.Router();

const isValidRole: CustomValidator = value => {
    return value === "teacher" || value === "student";
  };

const privateKey = fs.readFileSync('resources/private.key');
const publicKey = fs.readFileSync('resources/public.key');

auth.post("/register",
          body('email').isEmail(),
          body('password').isLength({ min: 8 }),
          body('role').custom(isValidRole),
          async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const emailExist = await User.findOne({email: req.body.email});
            if(emailExist) return res.status(400).json({ errors: [{email: "Email already exists."}]});

            const ROUNDS = 10;
            const salt = await bcrypt.genSalt(ROUNDS);
            const encryptedPassword = await bcrypt.hash(req.body.password, salt);

            const user = new User({
                email: req.body.email,
                password: encryptedPassword,
                role: req.body.role});

            const result = user.save((err,doc) => {
                if(err){
                    console.log(err);
                    return res.status(400).json({ errors: [{email: "Email already exists."}]});
                }
                res.status(200).json({
                    succes:true,
                    id: doc._id,
                    token: jwt.sign({role: req.body.role, email: req.body.email}, privateKey, { algorithm: 'RS256' })
                });
            })});

auth.post("/login",
          body('email').isEmail(),
          body('password').isLength({ min: 8 }),
          async (req,res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const result = User.findOne({email: req.body.email}, (err, user) =>
            {if(!user) return res.status(400).json({ errors: [{user: "This email doesn't match any user."}]});
            if(bcrypt.compare(req.body.password, user.password)){
                return res.status(200).json({
                        succes:true,
                        token: jwt.sign({role: user.role, email: user.email}, privateKey, { algorithm: 'RS256' })});}
            return res.status(400).json({ errors: [{password: "Invalid password."}]});});
          });

auth.post("/create-user",
          (req,res) => {
            res.status(200).send('Welcome to login , sign-up api');
          });

export default auth;