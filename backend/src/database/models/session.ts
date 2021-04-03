import * as mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    accessCode: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        required: true
    },
}, {
    collection: 'sessions'
})

export const Session = mongoose.model('Session', sessionSchema)