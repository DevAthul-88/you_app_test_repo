import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {}

  async onModuleInit() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
    this.channel = await this.connection.createChannel();

    console.log('Connected to RabbitMQ');
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();

    console.log('Disconnected from RabbitMQ');
  }

  async publishMessage(exchange: string, routingKey: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel is not initialized');
      }

      await this.channel.assertExchange(exchange, 'direct', { durable: true });

      const messageBuffer = Buffer.from(JSON.stringify(message));

      this.channel.publish(exchange, routingKey, messageBuffer);
      console.log(`Message published to exchange "${exchange}" with routing key "${routingKey}":`, message);
    } catch (error) {
      console.error('Error publishing message to RabbitMQ:', error);
      throw error;
    }
  }

  async consume(queue: string, callback: (message: string) => void) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }

    await this.channel.assertQueue(queue, { durable: true });

    this.channel.consume(queue, (msg) => {
      if (msg) {
        const message = msg.content.toString();
        callback(message);
        this.channel.ack(msg);
      }
    });

    console.log(`Waiting for messages in queue "${queue}"...`);
  }
}