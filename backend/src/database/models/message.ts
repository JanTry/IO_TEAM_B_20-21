import * as mongoose from 'mongoose';

export interface MessageType {
  senderName: string;
  text: string;
  date?: Date;
}

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'messages',
  }
);

export const Message = mongoose.model('Message', messageSchema);
