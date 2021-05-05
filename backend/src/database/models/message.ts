import { model, Schema, Types } from 'mongoose';

export interface MessageType {
  senderID: Types.ObjectId;
  text: string;
  date?: Date;
}

const messageSchema = new Schema(
  {
    senderID: {
      type: Types.ObjectId,
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

export const Message = model('Message', messageSchema);
