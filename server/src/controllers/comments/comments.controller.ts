import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';

import { CommentsService } from 'src/services/comments/comments.service';

@Controller('api/v1/comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get('/find-all')
  findAllComment(
    @Query('postId') id: string,
    @Query('cursor') cursor: string,
    @Query('createdAt') createdAt: string,
  ) {
    return this.commentService.getAllComments(id, cursor, createdAt);
  }

  @Post('/add')
  addComment(@Req() req: Request) {
    return this.commentService.addComment(req.body);
  }

  @Post('/like_or_dislike')
  likeOrDislikeComment(
    @Body('commentId') commentId: string,
    @Body('likedBy') likedBy: string,
  ) {
    return this.commentService.likeOrDislikeComment(commentId, likedBy);
  }
}
