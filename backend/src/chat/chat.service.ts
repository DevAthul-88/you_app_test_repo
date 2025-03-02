import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './message.entity';
import { MessageBuilder } from './message-builder';
import filter from 'leo-profanity';
import { UserBlock } from './schemas/block.schema';


@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserBlock.name) private userBlockModel: Model<UserBlock>
  ) { }

  private async isUserBlocked(senderId: string, receiverId: string): Promise<boolean> {
    const block = await this.userBlockModel.findOne({
      blockerId: receiverId,
      blockedId: senderId,
    });
    return !!block;
  }

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    const existingBlock = await this.userBlockModel.findOne({
      blockerId,
      blockedId,
    });

    if (existingBlock) {
      throw new Error('User is already blocked');
    }

    const block = new this.userBlockModel({ blockerId, blockedId });
    await block.save();
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const block = await this.userBlockModel.findOneAndDelete({
      blockerId,
      blockedId,
    });

    if (!block) {
      throw new Error('No block found to unblock');
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<ChatDocument> {
    let replyToId: Types.ObjectId | null = null;

    if (sendMessageDto.replyTo) {
      replyToId = new Types.ObjectId(sendMessageDto.replyTo);
      const replyToMessage = await this.chatModel.findById(replyToId);
      if (!replyToMessage) {
        throw new Error('Reply to message not found');
      }
    }

    const isBlocked = await this.isUserBlocked(
      sendMessageDto.senderId,
      sendMessageDto.receiverId
    );
    if (isBlocked) {
      throw new Error('You have been blocked by this user and cannot send messages');
    }
    sendMessageDto.message = filter.clean(sendMessageDto.message);

    const message = new MessageBuilder(
      sendMessageDto.senderId,
      sendMessageDto.receiverId,
      sendMessageDto.message,
      replyToId
    ).build();

    const messageDoc = new this.chatModel(message);
    return messageDoc.save();
  }

  async getMessages(userId: string, contactId: string): Promise<Message[]> {
    await this.markMessagesAsSeen(userId, contactId);

    const messages = await this.chatModel
      .find({
        $or: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    return this.buildMessageThreads(messages);
  }

  private buildMessageThreads(messages: ChatDocument[]): Message[] {
    const messageMap = new Map<string, Message>();
    const messageThreads: Message[] = [];

    messages.forEach(message => {
      const msg = new Message(
        message.senderId,
        message.receiverId,
        message.message,
        message.replyTo,
        message._id.toString()
      );

      msg.replies = [];
      msg.createdAt = message.createdAt;
      msg.updatedAt = message.updatedAt;
      msg.isSeen = message.isSeen;

      messageMap.set(message._id.toString(), msg);
    });

    messages.forEach(message => {
      const messageId = message._id.toString();

      if (message.replyTo) {
        const replyToId = message.replyTo.toString();
        const parentMessage = messageMap.get(replyToId);
        const childMessage = messageMap.get(messageId);

        if (parentMessage && childMessage) {
          parentMessage.replies.push(childMessage);
        } else {
          const orphanMessage = messageMap.get(messageId);
          if (orphanMessage) {
            messageThreads.push(orphanMessage);
          }
        }
      } else {
        const rootMessage = messageMap.get(messageId);
        if (rootMessage) {
          messageThreads.push(rootMessage);
        }
      }
    });

    return messageThreads;
  }

  async markMessagesAsSeen(userId: string, contactId: string): Promise<any> {
    const result = await this.chatModel.updateMany(
      {
        senderId: contactId,
        receiverId: userId,
        isSeen: false
      },
      {
        $set: {
          isSeen: true,
          updatedAt: new Date()
        }
      }
    ).exec();

    return result;
  }

  async deleteMessage(messageId: string): Promise<ChatDocument | null> {
    try {
      const objectId = new Types.ObjectId(messageId);

      const message = await this.chatModel.findById(objectId);
      if (message) {
        await this.chatModel.deleteMany({
          replyTo: objectId
        });
      }

      return this.chatModel.findByIdAndDelete(objectId).exec();
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<ChatDocument | null> {
    try {
      const objectId = new Types.ObjectId(messageId);
      return this.chatModel.findByIdAndUpdate(
        objectId,
        {
          $set: {
            message: newContent,
            updatedAt: new Date()
          }
        },
        {
          new: true,
          runValidators: true
        }
      ).exec();
    } catch (error) {
      throw new Error(`Failed to edit message: ${error.message}`);
    }
  }
}
