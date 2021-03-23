const mongoose = require('mongoose')
const db = require('./dbUtils')
db.connect()

const users = require('./collectionsUtils/userUtils')
const messages = require('./collectionsUtils/messageUtils')


console.log("Testing messages collection population:")
messages.populateMessagesCollection(1000)
// messages.printMessages()
// messages.clearMessagesCollection()
console.log("Testing users collection population:")
users.populateUsersCollection(1000)
// users.printUsers()
// users.clearUsersCollection()
