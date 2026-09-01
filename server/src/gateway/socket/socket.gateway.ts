import { OnModuleInit, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
  constructor(private messageService: ConversationsService) {}

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

  // Each client joins a room named after their own userId so events (new
  // messages, notifications) can be pushed only to the users involved
  // instead of broadcasting to every connected socket.
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    if (userId) client.join(userId);
  }

  @SubscribeMessage('get_messages')
  async getUserMessages(
    @MessageBody()
    payload: {
      userId: string;
    },
  ) {
    try {
      if (!payload.userId) {
        throw new WsException('User ID is required');
      }
      const messages = await this.messageService.getPersonalMessage(
        payload.userId,
      );
      this.server.to(payload.userId).emit('set_messages', messages);
    } catch (e) {
      throw new WsException(e.message || 'Failed to fetch messages');
    }
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() payload: SendMessageSchema) {
    try {
      await this.messageService.sendPersonalMessage(payload);
      const messages = await this.messageService.getPersonalMessage(
        payload.userId,
      );
      this.server
        .to(payload.userId)
        .to(payload.recipient_id)
        .emit('set_messages', messages);
    } catch (e) {
      throw new WsException(e.message || 'Failed to send message');
    }
  }

  @SubscribeMessage('edit_message')
  async editMessage(
    @MessageBody()
    payload: {
      userId: string;
      messageId: string;
      content: string;
      recipientId: string;
    },
  ) {
    try {
      await this.messageService.editMessage(
        payload.userId,
        payload.messageId,
        payload.content,
      );
      const messages = await this.messageService.getPersonalMessage(
        payload.userId,
      );
      this.server
        .to(payload.userId)
        .to(payload.recipientId)
        .emit('set_messages', messages);
    } catch (e) {
      throw new WsException(e.message || 'Failed to edit message');
    }
  }
}
