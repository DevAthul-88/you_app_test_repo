import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ default: null })
    bio?: string;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ default: null })
    gender?: string;

    @Prop({ default: null })
    zodiacSign?: string;

    @Prop({ default: null })
    horoscope?: string;

    @Prop({ default: null })
    location?: string;

    @Prop({ default: null })
    profileImage?: string;

    @Prop({ type: [String], default: [] })
    interests?: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
