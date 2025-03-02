import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  senderId: string;

  @Prop({ required: true, type: String })
  receiverId: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Chat', default: null })
  replyTo: Types.ObjectId | null;

  @Prop({ default: false })
  isSeen: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);