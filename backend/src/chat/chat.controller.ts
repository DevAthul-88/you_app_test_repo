import { Controller, Post, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sendMessage')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    try {
      return await this.chatService.sendMessage(sendMessageDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('viewMessages/:userId/:contactId')
  async getMessages(
    @Param('userId') userId: string, 
    @Param('contactId') contactId: string
  ) {
    try {
      return await this.chatService.getMessages(userId, contactId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('deleteMessage/:messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    try {
      const result = await this.chatService.deleteMessage(messageId);
      if (!result) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Message deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('block/:blockerId/:blockedId')
  async blockUser(
    @Param('blockerId') blockerId: string,
    @Param('blockedId') blockedId: string
  ) {
    try {
      return await this.chatService.blockUser(blockerId, blockedId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('unblock/:blockerId/:blockedId')
  async unblockUser(
    @Param('blockerId') blockerId: string,
    @Param('blockedId') blockedId: string
  ) {
    try {
      return await this.chatService.unblockUser(blockerId, blockedId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
