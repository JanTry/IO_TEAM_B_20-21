import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    surname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    role:{
        type: String,
        required: true
    }},
    {
    collection: 'users'
})

export const User = mongoose.model('User', userSchema)
export const UserSchema = userSchema


