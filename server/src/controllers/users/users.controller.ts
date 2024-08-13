import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Query,
  Body,
  Put,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from 'src/services/users/users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  showUsers(@Query('userId') id: string, @Query('limit') limit: number) {
    const isNan = Number.isNaN(+limit);
    return this.userService.getUsers(id, isNan ? 8 : +limit);
  }

  @Get('/search')
  searchUser(@Query('username') query: string) {
    return this.userService.searchUser(query);
  }

  @Get('/followers')
  getUserFollowers(@Query('userId') userId: string) {
    return this.userService.getUserFollowers(userId);
  }

  @Get('/following')
  getUserFollowing(@Query('userId') userId: string) {
    return this.userService.getUserFollowing(userId);
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('/follow_unfollow')
  followOrUnfollow(
    @Body('userToFollow') userToFollow: string,
    @Body('userId') userId: string,
  ) {
    return this.userService.followOrUnfollow(userToFollow, userId);
  }

  @Post('/create')
  createNewUser(@Req() req: Request) {
    return this.userService.createUser(req.body);
  }

  @Put('/update/bio')
  updateUserBio(@Body('bio') bio: string, @Body('userId') id: string) {
    return this.userService.updateBio(bio, id);
  }

  @Put('/update/setting')
  updateSetting(
    @Body('userId') userId: string,
    @Body('userSessionId') userSessionId: string,
    @Body('show_mention') showMention: boolean,
    @Body('show_saved_post') showSavedPost: boolean,
    @Body('show_draft_posts') showDraftPosts: boolean,
  ) {
    return this.userService.updateUserSetting(
      userId,
      userSessionId,
      showMention,
      showSavedPost,
      showDraftPosts,
    );
  }
}
