// const Message = require("../models/message")
import {Message} from '../models/message'

export const addMessage = async (messageData) => {
    try{
        return await new Message(messageData).save()
    } catch(error) {
        console.log("ERROR during addMessage : ", error)
    }
}
export const findOneMessage = async (messageData) => {
    try{
        return await Message.findOne(messageData)
    } catch (error) {
        console.log("ERROR during findOneMessage : ", error)
    }
}
export const findMessages = async (messageData) => {
    try{
        return await Message.find(messageData)
    } catch (error) {
        console.log("ERROR during findMessages : ", error)
    }
}
export const deleteMessage = async (messageData) => {
    try{
        return await (await Message.deleteOne(messageData)).ok
    } catch (error) {
        console.log("ERROR during deleteMessage : ", error)
    }
}
export const deleteManyMessages = async (messageData) => {
    try{
        return await (await Message.deleteMany(messageData)).deletedCount
    } catch (error) {
        console.log("ERROR during deleteManyMessages : ", error)
    }
}



export const printMessages = async (messageData={}) => {
    console.log(await findMessages(messageData))
}

export const clearMessagesCollection = async () => {
    console.log('Messages collection cleared, ', await deleteManyMessages({}), ' messages deleted')
}

export const populateMessagesCollection = async (n = 10) => {
    for(let i=1; i<=n; i++){
        await  addMessage({
            sender_name : 'Sender',
            text : 'MessageText_'+i
        })
    }
    console.log(n," new messages added to messages")
}
