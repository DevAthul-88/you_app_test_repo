import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Types, Document } from 'mongoose';
import { Chat } from './schemas/chat.schema';
import { Message } from './message.entity';

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  // Define the complete document type that matches Mongoose's expectations
  type ChatDocument = Document<unknown, {}, Chat> &
    Chat &
    Required<{ _id: unknown }> &
  { __v: number };

  const createMockChatDocument = (data: Partial<Chat>): ChatDocument => {
    const baseData = {
      senderId: data.senderId || '',
      receiverId: data.receiverId || '',
      message: data.message || '',
      isSeen: data.isSeen ?? false,
      _id: data._id || new Types.ObjectId(),
      __v: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const documentMethods = {
      $assertPopulated: jest.fn(),
      $clearModifiedPaths: jest.fn(),
      $clone: jest.fn(),
      $createModifiedPathsSnapshot: jest.fn(),
      $delete: jest.fn(),
      $getPopulatedDocs: jest.fn(),
      $getAllSubdocs: jest.fn(),
      $ignore: jest.fn(),
      $isDefault: jest.fn(),
      $isDeleted: jest.fn(),
      $isEmpty: jest.fn(),
      $isValid: jest.fn(),
      $markValid: jest.fn(),
      $model: jest.fn(),
      $parent: jest.fn(),
      $session: jest.fn(),
      $set: jest.fn(),
      toJSON: () => baseData,
      toObject: () => baseData,
      populate: jest.fn().mockReturnThis(),
      populated: jest.fn(),
      depopulate: jest.fn(),
      equals: jest.fn(),
      get: jest.fn(),
      inspect: jest.fn(),
      invalidate: jest.fn(),
      modifiedPaths: jest.fn(),
      set: jest.fn(),
      unmarkModified: jest.fn(),
      increment: jest.fn(),
      remove: jest.fn(),
      save: jest.fn().mockResolvedValue(baseData),
      validate: jest.fn().mockResolvedValue(true),
      validateSync: jest.fn(),
      directModifiedPaths: jest.fn(),
      isDirectModified: jest.fn(),
      isDirectSelected: jest.fn(),
      isInit: jest.fn(),
      isModified: jest.fn(),
      isSelected: jest.fn(),
      markModified: jest.fn(),
      // Document properties
      $locals: {},
      $op: null,
      $where: {},
      collection: {},
      db: {},
      errors: {},
      id: baseData._id.toString(),
      isNew: false,
      modelName: 'Chat',
      schema: {},
      overwrite: jest.fn(),
      replaceOne: jest.fn(),
      update: jest.fn(),
      updateOne: jest.fn(),
    };

    return {
      ...baseData,
      ...documentMethods
    } as unknown as ChatDocument;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            sendMessage: jest.fn(),
            getMessages: jest.fn(),
          },
        },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });


  describe('sendMessage', () => {
    it('should return success message when message is sent', async () => {
      const sendMessageDto: SendMessageDto = {
        senderId: 'user123',
        receiverId: 'user456',
        message: 'Hello!',
      };

      const mockChat = createMockChatDocument({
        senderId: sendMessageDto.senderId,
        receiverId: sendMessageDto.receiverId,
        message: sendMessageDto.message,
        _id: new Types.ObjectId(),
        isSeen: false,
      });

      jest.spyOn(chatService, 'sendMessage').mockResolvedValue(mockChat);

      const result = await chatController.sendMessage(sendMessageDto);
      expect(result).toEqual(mockChat);
      expect(chatService.sendMessage).toHaveBeenCalledWith(sendMessageDto);
    });

    it('should throw error if sending message fails', async () => {
      const sendMessageDto: SendMessageDto = {
        senderId: 'user123',
        receiverId: 'user456',
        message: 'Hello!',
      };

      const errorMessage = 'Error sending message';
      jest.spyOn(chatService, 'sendMessage').mockRejectedValue(new Error(errorMessage));

      await expect(chatController.sendMessage(sendMessageDto)).rejects.toThrowError(errorMessage);
    });
  });

  describe('getMessages', () => {
    it('should return messages between two users', async () => {
      const userId = 'user123';
      const contactId = 'user456';

      const message1 = new Message(userId, contactId, 'Hello!');
      const message2 = new Message(contactId, userId, 'Hi!');
      message2.markAsSeen();

      const messages: Message[] = [message1, message2];

      jest.spyOn(chatService, 'getMessages').mockResolvedValue(messages);

      const result = await chatController.getMessages(userId, contactId);
      expect(result).toEqual(messages);
      expect(chatService.getMessages).toHaveBeenCalledWith(userId, contactId);
    });

    it('should return an empty array if no messages are found', async () => {
      const userId = 'user123';
      const contactId = 'user456';

      jest.spyOn(chatService, 'getMessages').mockResolvedValue([]);

      const result = await chatController.getMessages(userId, contactId);
      expect(result).toEqual([]);
      expect(chatService.getMessages).toHaveBeenCalledWith(userId, contactId);
    });
  });


});