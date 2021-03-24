import * as mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: false
    }
}, {
    collection: 'users'
})

export const User = mongoose.model('User', userSchema)

