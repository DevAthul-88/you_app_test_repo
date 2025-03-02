import { Types } from 'mongoose';
import { Message } from './message.entity';

export class MessageBuilder {
  private senderId: string;
  private receiverId: string;
  private message: string;
  private replyTo: Types.ObjectId | null;

  constructor(
    senderId: string, 
    receiverId: string, 
    message: string, 
    replyTo: Types.ObjectId | null = null
  ) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.message = message;
    this.replyTo = replyTo;
  }

  setSenderId(senderId: string): MessageBuilder {
    this.senderId = senderId;
    return this;
  }

  setReceiverId(receiverId: string): MessageBuilder {
    this.receiverId = receiverId;
    return this;
  }

  setMessage(message: string): MessageBuilder {
    this.message = message;
    return this;
  }

  setReplyTo(replyTo: Types.ObjectId | null): MessageBuilder {
    this.replyTo = replyTo;
    return this;
  }

  build(): Message {
    return new Message(
      this.senderId,
      this.receiverId,
      this.message,
      this.replyTo
    );
  }
}