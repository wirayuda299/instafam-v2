import { Body, Controller, Get, Put, Query } from '@nestjs/common';

import { NotificationsService } from 'src/services/notifications/notifications.service';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Query('userId') userId: string) {
    return this.notificationsService.getForUser(userId);
  }

  @Put('/mark-read')
  markAllRead(@Body('userId') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }
}
