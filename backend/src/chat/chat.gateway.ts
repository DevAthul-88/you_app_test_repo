// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { Logger } from '@nestjs/common';

let typingTimeout: NodeJS.Timeout;

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly rabbitMQService: RabbitMQService,
  ) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.sendMessage(sendMessageDto);

      this.server.to(sendMessageDto.receiverId).emit('newMessage', message);

      await this.rabbitMQService.publishMessage(
        'chat_exchange',
        'chat.newMessage',
        message,
      );

      this.logger.log(`Message sent to ${sendMessageDto.receiverId}: ${message}`);

      return { status: 'Message sent', message };
    } catch (error) {
      this.logger.error('Error sending message:', error);
      throw error;
    }
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(
    @MessageBody() { blockerId, blockedId }: { blockerId: string, blockedId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const response = await this.chatService.blockUser(blockerId, blockedId);

      this.logger.log(response);
      client.emit('userBlocked', { status: 'User blocked', blockerId, blockedId });
      return { status: 'User blocked', response };
    } catch (error) {
      this.logger.error('Error blocking user:', error);
      throw error;
    }
  }

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(
    @MessageBody() { blockerId, blockedId }: { blockerId: string, blockedId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const response = await this.chatService.unblockUser(blockerId, blockedId);

      this.logger.log(response);
      client.emit('userUnblocked', { status: 'User unblocked', blockerId, blockedId });
      return { status: 'User unblocked', response };
    } catch (error) {
      this.logger.error('Error unblocking user:', error);
      throw error;
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { userId: string, contactId: string }, @ConnectedSocket() client: Socket) {
    clearTimeout(typingTimeout);
  
    typingTimeout = setTimeout(() => {
      client.to(data.contactId).emit('typing', { userId: data.userId });
    }, 500);
  }
}
