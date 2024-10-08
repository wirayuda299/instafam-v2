import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { addCommentSchema, AddCommentSchema } from 'src/common/validation';
import { Comment } from 'src/types';

@Injectable()
export class CommentsService {
  constructor(private db: DatabaseService) { }

  async addComment(values: AddCommentSchema) {
    try {
      const validatedValue = addCommentSchema.safeParse(values);
      if (!validatedValue) {
        throw new BadRequestException('Please add valid data');
      }
      const { author, comment, post_id } = validatedValue.data;
      await this.db.pool.query(`begin`);
      await this.db.pool.query(
        `
        insert into comments(author,message, post_id)
        values($1, $2, $3)
        `,
        [author, comment, post_id],
      );
      await this.db.pool.query(`commit`);
    } catch (error) {
      await this.db.pool.query(`rollback`);
      throw error;
    }
  }

  async getAllComments(
    postId: string,
    lastCursor?: string,
    createdAt?: string,
  ): Promise<Comment[]> {
    try {
      if (!postId) {
        throw new BadRequestException('Post ID is required');
      }

      const queryWithoutCursor = ` select
        c.id as comment_id,
        c.author as author,
        c.message as comment,
        c.created_at,
        c.updated_at,
        u.username,
        u.profile_image,
        c.post_id
        from comments as c
        join users as u on u.id = c.author
        where c.post_id = $1
      ORDER BY c.created_at DESC
      LIMIT 10`;

      const queryWithCursor = ` select
        c.id as comment_id,
        c.author as author,
        c.comment as message,
        c.created_at,
        c.updated_at,
        u.username,
        u.profile_image,
        c.post_id
        from comments as c
        join users as u on u.id = c.author
        WHERE (c.created_at, c.post_id) < ($1, $2) and c.post_id = $3
      ORDER BY c.created_at DESC
      LIMIT 10`;

      const query = lastCursor ? queryWithCursor : queryWithoutCursor;
      const params = lastCursor ? [createdAt, lastCursor, postId] : [postId];

      const comments = await this.db.pool.query(query, params);

      if (comments.rows.length > 0) {
        for await (const comment of comments.rows) {
          const likes = await this.db.pool.query(
            `select
                comment_id, liked_by
                from comment_likes
                where comment_id = $1
          `,
            [comment.comment_id],
          );
          comment.likes = likes.rows;
        }
      }

      return comments.rows as Comment[];
    } catch (error) {
      throw error;
    }
  }

  async likeOrDislikeComment(commentId: string, liked_by: string) {
    try {
      await this.db.pool.query(`begin`);
      const isLiked = await this.db.pool.query(
        `select * from comment_likes as cl
        where cl.comment_id = $1 and cl.liked_by = $2
        `,
        [commentId, liked_by],
      );

      if (isLiked.rows.length > 0) {
        await this.db.pool.query(
          `delete from comment_likes where comment_id = $1 and liked_by = $2`,
          [commentId, liked_by],
        );
      } else {
        await this.db.pool.query(
          `insert into comment_likes (comment_id, liked_by) values($1,$2)`,
          [commentId, liked_by],
        );
      }
      await this.db.pool.query(`commit`);
    } catch (error) {
      await this.db.pool.query(`rollback`);
      throw error;
    }
  }
}
