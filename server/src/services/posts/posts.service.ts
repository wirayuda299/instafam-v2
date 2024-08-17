import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { createPostSchema, CreatePostType } from 'src/common/validation';
import { Post, PostLike } from 'src/types';

@Injectable()
export class PostsService {
  constructor(private db: DatabaseService) {}

  async createPost(data: CreatePostType) {

    try {
      const validatedValues = createPostSchema.safeParse(data);

      if (!validatedValues.success) {
        throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      }

      const { captions, author, media_asset_id, media_url, published } =
        validatedValues.data;

      await this.db.pool.query(`begin`);
      await this.db.pool
        .query(
          `INSERT INTO posts (author, captions, media_url, media_asset_id, published)
         VALUES ($1, $2, $3, $4, $5)`,
          [author, captions, media_url, media_asset_id, published],
        )
        .then(() => {
          return {
            messages: 'Post has been created',
            error: false,
          };
        });

      await this.db.pool.query(`commit`);
    } catch (error) {
      await this.db.pool.query(`rollback`);
      throw error;
    }
  }

  async reportPost(postId: string, reasons: string[]) {
    try {
      await this.db.pool.query(
        `insert into report (post_id, reason)
					values($1, $2)`,
        [postId, reasons],
      );
      return {
        message: 'Post has been reported',
      };
    } catch (e) {
      throw e;
    }
  }

  async getAllPosts(
    lastCursor?: string,
    createdAt?: string,
  ): Promise<{
    posts: Post[];
    totalPosts: number;
  }> {
    try {
      const totalPosts = await this.db.pool.query(
        `select count(*) from posts `,
      );
      const queryWithCursor = `
      SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt,
        p.media_asset_id AS media_asset_id,
        COUNT(pl.post_id) AS likes_count
        FROM posts AS p
        JOIN users AS u ON u.id = p.author
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        WHERE (p.createdAt, p.id) < ($1, $2) and p.published = true
        GROUP BY p.id, p.author, u.username, u.profile_image, p.captions,p.published, p.media_url, p.createdAt, p.media_asset_id
        ORDER BY likes_count DESC, p.createdAt DESC, p.id DESC
        LIMIT 10
    `;

      const queryWithoutCursor = `
      SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt,
        COUNT(pl.post_id) AS likes_count,
        p.media_asset_id AS media_asset_id
        FROM posts AS p
        JOIN users AS u ON u.id = p.author
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        where p.published = true
        GROUP BY p.id, p.published, p.author, u.username, u.profile_image, p.captions, p.media_url, p.createdAt, p.media_asset_id
        ORDER BY likes_count DESC, p.createdAt DESC, p.id DESC
        LIMIT 10
    `;

      const query = lastCursor ? queryWithCursor : queryWithoutCursor;
      const params = lastCursor ? [createdAt, lastCursor] : [];

      const posts = await this.db.pool.query(query, params);

      if (posts.rows.length > 0) {
        for await (const post of posts.rows) {
          const likes = await this.getPostLikes(post.post_id);
          post.likes = likes || [];
        }
      }

      return {
        posts: posts.rows,
        totalPosts: +totalPosts.rows[0].count,
      };
    } catch (error) {
			console.log("error fetch posts", error)
      throw error;
    }
  }

  async getPostById(postId: string): Promise<Post> {
    try {
      const post = await this.db.pool.query(
        `
       SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt,
        p.media_asset_id AS media_asset_id
        FROM posts AS p
        JOIN users AS u ON u.id = p.author
        where p.id = $1 and p.published =true`,
        [postId],
      );

      const likes = await this.getPostLikes(post.rows[0].post_id);
      post.rows[0].likes = likes || [];
      return post.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async deletePost(postId: string, postAuthor: string, userSession: string) {
    try {
      if (postAuthor !== userSession) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const post = await this.db.pool.query(
        `select exists(select * from posts where id =$1)`,
        [postId],
      );
      if (!post.rows[0].exists) {
        throw new NotFoundException('Post not found');
      }
      await this.db.pool.query(`begin`);
      await this.db.pool
        .query(`delete from posts where id = $1`, [postId])
        .then(() => {
          return {
            messages: 'Post successfully deleted',
            error: false,
          };
        });
      await this.db.pool.query(`commit`);
    } catch (error) {
      await this.db.pool.query(`rollback`);
      throw error;
    }
  }

  async getPostLikes(postId: string): Promise<PostLike[]> {
    try {
      const likes = await this.db.pool.query(
        `select
          pl.post_id,
          pl.liked_by
          from post_likes as pl
          where pl.post_id= $1
        `,
        [postId],
      );
      return likes.rows || [];
    } catch (error) {
      throw error;
    }
  }

  async likeOrDislikePost(postId: string, liked_by: string) {
    try {
      await this.db.pool.query(`begin`);
      const isLiked = await this.db.pool.query(
        `select * from post_likes as pl
        where pl.post_id = $1 and pl.liked_by = $2
        `,
        [postId, liked_by],
      );

      if (isLiked.rows.length > 0) {
        await this.db.pool.query(
          `delete from post_likes where post_id = $1 and liked_by = $2`,
          [postId, liked_by],
        );
      } else {
        await this.db.pool.query(
          `insert into post_likes (post_id, liked_by) values($1,$2)`,
          [postId, liked_by],
        );
      }
      await this.db.pool.query(`commit`);
    } catch (error) {
      await this.db.pool.query(`rollback`);
      throw error;
    }
  }

  async getUserPosts(
    userId: string,
    published: boolean = true,
    lastCursor?: string,
    createdAt?: string,
  ) {
    try {
      const totalPosts = await this.db.pool.query(
        `select count(*) from posts where author= $1 and published = true`,
        [userId],
      );
      const queryWithCursor = `
      SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt,
        p.media_asset_id AS media_asset_id
        FROM posts AS p
        JOIN users AS u ON u.id = p.author
        WHERE (p.createdAt, p.id) < ($1, $2) and p.author = $3 and p.published= $4
        ORDER BY p.createdAt DESC, p.id DESC
        LIMIT 10
    `;

      const queryWithoutCursor = `
      SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt,
        p.media_asset_id AS media_asset_id
        FROM posts AS p
        JOIN users AS u ON u.id = p.author
        where p.author = $1 and p.published=$2
        ORDER BY p.createdAt DESC
        LIMIT 10
    `;

      const query = lastCursor ? queryWithCursor : queryWithoutCursor;
      const params = lastCursor
        ? [createdAt, lastCursor, userId, published]
        : [userId, published];

      const posts = await this.db.pool.query(query, params);

      if (posts.rows.length > 0) {
        for await (const post of posts.rows) {
          const likes = await this.getPostLikes(post.post_id);
          post.likes = likes || [];
        }
      }

      return {
        posts: posts.rows,
        totalPosts: +totalPosts.rows[0].count,
      };
    } catch (error) {
      throw error;
    }
  }

  async savePost(author: string, post_id: string) {
    try {
      await this.db.pool.query(`begin`);
      const isSaved = await this.db.pool.query(
        `select * from bookmarks where author = $1 and post_id = $2`,
        [author, post_id],
      );

      if (isSaved.rows.length > 0) {
        await this.db.pool.query(
          `delete from bookmarks where author = $1 and post_id = $2`,
          [author, post_id],
        );
        return {
          message: 'Post has been removed from your bookmarks',
        };
      } else {
        await this.db.pool.query(
          `insert into bookmarks(author, post_id)
          values($1,$2)`,
          [author, post_id],
        );
        await this.db.pool.query(`commit`);
        return {
          message: 'Post saved',
        };
      }
    } catch (error) {
      await this.db.pool.query(`rollback`);
      throw error;
    }
  }

  async getUserSavedPosts(author: string) {
    try {
      const savedPosts = await this.db.pool.query(
        `select
          p.id AS post_id,
          u.username AS author_name,
          u.profile_image AS profile_image,
          p.captions AS captions,
          p.media_url AS media_url,
          p.createdAt,
          p.media_asset_id AS media_asset_id,
          post_id,
          u.id as author
         from bookmarks as b
         join posts as p on p.id = b.post_id
         join users as u on u.id = $1
         where b.author = $1 and p.published = true`,
        [author],
      );

      return savedPosts.rows;
    } catch (error) {
      throw error;
    }
  }
}
