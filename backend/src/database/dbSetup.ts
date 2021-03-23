import * as db from './dbUtils'
db.connect()

import * as users from './collectionsUtils/userUtils'
import * as messages from './collectionsUtils/messageUtils'


console.log("Testing messages collection population:")
messages.populateMessagesCollection(1000)
// messages.printMessages()
// messages.clearMessagesCollection()
// console.log("Testing users collection population:")
// users.populateUsersCollection(1000)
// users.printUsers()
// users.clearUsersCollection()
