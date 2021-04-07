/* eslint-disable no-console */

import { Message, MessageType } from '../models/message';

export const addMessage = async (messageData: MessageType) => {
  return new Message(messageData).save();
};
export const findOneMessage = async (messageData: MessageType) => {
  return Message.findOne(messageData);
};
export const findMessages = async (messageData: MessageType) => {
  return Message.find(messageData);
};
export const deleteMessage = async (messageData: MessageType) => {
  return (await Message.deleteOne(messageData)).ok;
};
export const deleteManyMessages = async (messageData: MessageType) => {
  return (await Message.deleteMany(messageData)).deletedCount;
};

export const printMessages = async (messageData: MessageType) => {
  console.log(findMessages(messageData));
};

export const printAllMessages = async () => {
  console.log(Message.find({}));
};

export const clearMessagesCollection = async () => {
  return (await Message.deleteMany({})).deletedCount;
};

export const populateMessagesCollection = async (n = 10) => {
  for (let i = 1; i <= n; i++) {
    addMessage({
      senderName: 'Sender',
      text: `MessageText_${i}`,
    });
  }
  console.log(n, ' new messages added to messages');
};
