import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_URI', 'amqp://localhost'),
        exchanges: [
          {
            name: 'chat_exchange',
            type: 'direct',
          },
        ],
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
})
export class RabbitMQConfigModule {}