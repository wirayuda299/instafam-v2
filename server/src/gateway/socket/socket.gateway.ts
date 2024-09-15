import { OnModuleInit, UseFilters } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebSocketExceptionFilter } from 'src/common/error-handler';
import { SendMessageSchema } from 'src/common/validation';
import { ConversationsService } from 'src/services/conversations/conversations.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WebSocketExceptionFilter())
export class SocketGateway implements OnModuleInit {
  constructor(private messageService: ConversationsService) { }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', () => {
      console.log('Connected');
    });
    this.server.on('disconnect', () => {
      console.log('Disconnected');
    });
  }

  @SubscribeMessage('get_messages')
  async getUserMessages(
    @MessageBody()
    payload: { userId: string },
  ) {
    try {
      if (!payload.userId) {
        throw new WsException('User ID is required');
      }
      const messages = await this.messageService.getPersonalMessage(payload.userId);
      this.server.emit('set_messages', messages);
    } catch (e) {
      throw new WsException(e.message || 'Failed to fetch messages');
    }
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() payload: SendMessageSchema) {
    try {
      await this.messageService.sendPersonalMessage(payload);
      const messages = await this.messageService.getPersonalMessage(payload.userId);
      this.server.emit('set_messages', messages);
    } catch (e) {
      throw new WsException(e.message || 'Failed to send message');
    }
  }
}

