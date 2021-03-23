const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender_name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date : { 
        type: Date, 
        default: Date.now 
    }
}, { 
    collection: 'messages'
})


const Message = mongoose.model('Message', messageSchema)


module.exports = Message