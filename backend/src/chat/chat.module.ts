import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { UserBlockSchema } from './schemas/block.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'UserBlock', schema: UserBlockSchema }]),
  ],
  providers: [ChatService, ChatGateway, RabbitMQService],
  exports: [ChatService],
})
export class ChatModule {}