import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SendMessageSchema } from 'src/common/validation';
import { ConversationsService } from 'src/services/conversations/conversations.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnModuleInit {
  constructor(private messageService: ConversationsService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', () => {
      console.log('Connected');
    });
    this.server.on('disconnect', () => {
      console.log('disconnect');
    });
  }

  @SubscribeMessage('get_messages')
  async getUserMessages(
    @MessageBody()
    payload: {
      userId: string;
    },
  ) {
    try {
      const messages = await this.messageService.getPersonalMessage(
        payload.userId,
      );
      this.server.emit('set_messages', messages);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() payload: SendMessageSchema) {
    try {
      await this.messageService.sendPersonalMessage(payload);
    } catch (e) {
      console.log(e);
    }
  }
}
