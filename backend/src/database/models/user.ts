import * as mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    }},
    {
    collection: 'users'
})

export const User = mongoose.model('User', userSchema)

