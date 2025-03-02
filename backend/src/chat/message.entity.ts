import { Types } from 'mongoose';

export class Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  replyTo: string | null;
  replies: Message[]; // Change the type from string[] to Message[]
  createdAt: Date;
  updatedAt: Date;
  isSeen: boolean;

  constructor(
    senderId: string,
    receiverId: string,
    message: string,
    replyTo: Types.ObjectId | null = null,
    id?: string,
  ) {
    this.id = id || new Types.ObjectId().toString();
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.message = message;
    this.replyTo = replyTo?.toString() || null;
    this.replies = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isSeen = false;
  }

  markAsSeen() {
    this.isSeen = true;
    this.updatedAt = new Date();
  }
}
