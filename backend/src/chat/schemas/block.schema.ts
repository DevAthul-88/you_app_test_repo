import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserBlock extends Document {
  @Prop({ required: true })
  blockerId: string;

  @Prop({ required: true })
  blockedId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserBlockSchema = SchemaFactory.createForClass(UserBlock);
