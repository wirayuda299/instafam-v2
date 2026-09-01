import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { UsersService } from './services/users/users.service';
import { DatabaseService } from './services/database/database.service';
import { UsersController } from './controllers/users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { PostsService } from './services/posts/posts.service';
import { PostsController } from './controllers/posts/posts.controller';
import { CommentsService } from './services/comments/comments.service';
import { CommentsController } from './controllers/comments/comments.controller';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { ConversationsService } from './services/conversations/conversations.service';
import { ConversationsController } from './controllers/conversations/conversations.controller';
import { CloudinaryModule } from './cloudinary/cloudinary/cloudinary.module';
import { UploadController } from './controllers/cloudinary/cloudinary.controller';
import { NotificationsService } from './services/notifications/notifications.service';
import { NotificationsController } from './controllers/notifications/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CloudinaryModule,
  ],
  controllers: [
    AppController,
    UsersController,
    PostsController,
    CommentsController,
    ConversationsController,
    UploadController,
    NotificationsController,
  ],
  providers: [
    SocketGateway,
    UsersService,
    DatabaseService,
    PostsService,
    CommentsService,
    ConversationsService,
    NotificationsService,
  ],
})
export class AppModule {}
