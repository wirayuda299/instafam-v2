import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { PostsService } from 'src/services/posts/posts.service';

@Controller('api/v1/posts')
export class PostsController {
  constructor(private postService: PostsService) { }

  @Get()
  getUserPosts(
    @Query('cursor') cursor: string,
    @Query('createdAt') createdAt: string,
    @Query('userId') userId: string,
    @Query('published') published: boolean,
  ) {
    return this.postService.getUserPosts(userId, published, cursor, createdAt);
  }
  @Get('/find-all')
  getPosts(
    @Query('cursor') cursor: string,
    @Query('createdAt') createdAt: string,
  ) {
    return this.postService.getAllPosts(cursor, createdAt);
  }
  @Get('/bookmarked_post')
  getBookmarkedPosts(@Query('author') author: string) {
    return this.postService.getUserSavedPosts(author);
  }
  @Get(':id')
  getPost(@Param() params: any) {
    return this.postService.getPostById(params.id);
  }

  @Post('/create')
  createNewPost(@Req() req: Request) {
    return this.postService.createPost(req.body);
  }

  @Post('/like_or_dislike')
  likeOrDislikePost(
    @Body('postId') postId: string,
    @Body('liked_by') likedBy: string,
  ) {
    return this.postService.likeOrDislikePost(postId, likedBy);
  }
  @Post('/save_or_delete')
  savePost(@Body('postId') postId: string, @Body('author') savedBy: string) {
    return this.postService.savePost(savedBy, postId);
  }

  @Delete('/delete')
  deletePost(@Req() req: Request) {
    const { postId, userSession, postAuthor } = req.body;

    return this.postService.deletePost(postId, postAuthor, userSession);
  }
}
