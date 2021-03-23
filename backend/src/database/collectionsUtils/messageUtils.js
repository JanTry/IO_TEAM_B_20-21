const Message = require("../models/message")

const addMessage = async (data) => {
    try{
        const message = new Message(data)
        await message.save()
    } catch(error) {
        console.log("ERROR during addMessage : ", error)
    }
}
const findOneMessage = async (data) => {
    try{
        const message = await Message.findOne(data)
        return message
    } catch (error) {
        console.log("ERROR during findOneMessage : ", error)
    }
}
const findMessages = async (data) => {
    try{
        const messages = await Message.find(data)
        return messages
    } catch (error) {
        console.log("ERROR during findMessages : ", error)
    }
}
const deleteMessage = async (data) => {
    try{
        const message = await Message.deleteOne(data)
        return message.ok
    } catch (error) {
        console.log("ERROR during deleteMessage : ", error)
    }
}
const deleteManyMessages = async (data) => {
    try{
        const messages = await Message.deleteMany(data)
        return messages.deletedCount
    } catch (error) {
        console.log("ERROR during deleteManyMessages : ", error)
    }
}



const printMessages = async (data={}) => {
    console.log(await (await findMessages(data)))
}

const clearMessagesCollection = async () => {
    console.log('Messages collection cleared, ', await deleteManyMessages({}), ' messages deleted')
}

const populateMessagesCollection = async (n = 10) => {
    for(i=1; i<=n; i++){
        await  addMessage({
            sender_name : 'Sender',
            text : 'MessageText_'+i
        })
    }
    console.log(n," new messages added to messages")
}

module.exports = {addMessage, findOneMessage, findMessages, deleteMessage, deleteManyMessages, printMessages, clearMessagesCollection, populateMessagesCollection}