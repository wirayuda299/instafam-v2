import { Controller, Get, Query } from '@nestjs/common';
import { ConversationsService } from 'src/services/conversations/conversations.service';

@Controller('api/v1/conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Get()
  getConversations(@Query('userId') userId: string) {
    return this.conversationsService.getUserConversations(userId);
  }

  @Get('/messages')
  getPersonalMessage(@Query('userId') userId: string) {
    return this.conversationsService.getPersonalMessage(userId);
  }
}
