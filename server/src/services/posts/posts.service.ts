import {
  NotFoundException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { createPostSchema, CreatePostType } from 'src/common/validation';
import { Post, PostLike } from 'src/types';

@Injectable()
export class PostsService {
  constructor(
    private db: DatabaseService,
    private notifications: NotificationsService,
  ) {}

  async createPost(data: CreatePostType) {
    const validatedValues = createPostSchema.safeParse(data);
    if (!validatedValues.success)
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);

    const { captions, author, media_asset_id, media_url, published } =
      validatedValues.data;

    try {
      await this.db.transaction((client) =>
        client.query(
          `INSERT INTO posts (author, captions, media_url, media_asset_id, published)
                     VALUES ($1, $2, $3, $4, $5)`,
          [author, captions, media_url, media_asset_id, published],
        ),
      );
    } catch (error) {
      console.log('error create post', error);
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
    created_at?: string,
  ): Promise<{ posts: Post[]; totalPosts: number }> {
    try {
      const totalPosts = await this.db.pool.query(`SELECT COUNT(*) FROM posts`);

      const queryWithCursor = `
      SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt AS created_at,
        p.media_asset_id AS media_asset_id,
        COUNT(pl.post_id) AS likes_count
      FROM posts AS p
      JOIN users AS u ON u.id = p.author
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      WHERE (p.createdAt, p.id) < ($1, $2) AND p.published = true
      GROUP BY p.id, p.author, u.username, u.profile_image, p.captions, p.published, p.media_url, p.createdAt, p.media_asset_id
      ORDER BY likes_count DESC, p.createdAt DESC, p.id DESC
      LIMIT 10`;

      const queryWithoutCursor = `
      SELECT
        p.id AS post_id,
        p.author AS author_id,
        u.username AS author_name,
        u.profile_image AS profile_image,
        p.captions AS captions,
        p.media_url AS media_url,
        p.createdAt AS created_at,
        COUNT(pl.post_id) AS likes_count,
        p.media_asset_id AS media_asset_id
      FROM posts AS p
      JOIN users AS u ON u.id = p.author
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      WHERE p.published = true
      GROUP BY p.id, p.published, p.author, u.username, u.profile_image, p.captions, p.media_url, p.createdAt, p.media_asset_id
      ORDER BY likes_count DESC, p.createdAt DESC, p.id DESC
      LIMIT 10`;

      const query = lastCursor ? queryWithCursor : queryWithoutCursor;
      const params = lastCursor ? [created_at, lastCursor] : [];

      const posts = await this.db.pool.query(query, params);

      if (posts && posts?.rows.length > 0) {
        const postIds = posts.rows.map((post) => post.post_id);
        const likesPromises = postIds.map((postId) =>
          this.getPostLikes(postId),
        );
        const likesResults = await Promise.all(likesPromises);

        posts.rows.forEach((post, index) => {
          post.likes = likesResults[index] || [];
        });
      }

      return {
        posts: posts.rows,
        totalPosts: parseInt(totalPosts.rows[0].count, 10),
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getPostById(postId: string, viewerId?: string): Promise<Post | null> {
    try {
      const post = await this.db.pool.query(
        ` SELECT
                    p.id AS post_id,
                    p.author AS author_id,
                    u.username AS author_name,
                    u.profile_image AS profile_image,
                    p.captions AS captions,
                    p.media_url AS media_url,
                    p.createdAt AS created_at,
                    p.media_asset_id AS media_asset_id,
                    p.published AS published
                    FROM posts AS p
                    JOIN users AS u ON u.id = p.author
                    where p.id = $1 and (p.published = true or p.author = $2)`,
        [postId, viewerId ?? null],
      );

      if (post.rows.length < 1) return null;

      const likes = await this.getPostLikes(post.rows[0].post_id);
      post.rows[0].likes = likes || [];
      return post.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async deletePost(postId: string, postAuthor: string, userSession: string) {
    if (postAuthor !== userSession)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const post = await this.db.pool.query(
      `select exists(select * from posts where id =$1)`,
      [postId],
    );
    if (!post.rows[0].exists) throw new NotFoundException('Post not found');

    await this.db.transaction((client) =>
      client.query(`delete from posts where id = $1`, [postId]),
    );
  }

  async publishPost(postId: string, author: string) {
    const result = await this.db.pool.query(
      `update posts set published = true where id = $1 and author = $2`,
      [postId, author],
    );
    if (result.rowCount === 0) {
      throw new HttpException(
        'Post not found or you are not the author',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { message: 'Post has been published' };
  }

  async updateCaptions(postId: string, author: string, captions: string) {
    const result = await this.db.pool.query(
      `update posts set captions = $1 where id = $2 and author = $3`,
      [captions, postId, author],
    );
    if (result.rowCount === 0) {
      throw new HttpException(
        'Post not found or you are not the author',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { message: 'Post updated' };
  }

  async getPostLikes(postId: string): Promise<PostLike[]> {
    try {
      const likes = await this.db.pool.query(
        `select
                  pl.post_id,
                  pl.liked_by
                  from post_likes as pl
                  where pl.post_id= $1 `,
        [postId],
      );
      return likes.rows || [];
    } catch (error) {
      throw error;
    }
  }

  async likeOrDislikePost(postId: string, liked_by: string) {
    let postAuthor: string | null = null;

    await this.db.transaction(async (client) => {
      const isLiked = await client.query(
        `select * from post_likes as pl where pl.post_id = $1 and pl.liked_by = $2`,
        [postId, liked_by],
      );

      if (isLiked.rows.length > 0) {
        await client.query(
          `delete from post_likes where post_id = $1 and liked_by = $2`,
          [postId, liked_by],
        );
      } else {
        await client.query(
          `insert into post_likes (post_id, liked_by) values($1,$2)`,
          [postId, liked_by],
        );
        const author = await client.query(
          `select author from posts where id = $1`,
          [postId],
        );
        postAuthor = author.rows[0]?.author ?? null;
      }
    });

    if (postAuthor) {
      await this.notifications.notify(postAuthor, liked_by, 'like', postId);
    }
  }

  async getUserPosts(
    userId: string,
    published: boolean = true,
    lastCursor?: string,
    created_at?: string,
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
                    p.createdAt AS created_at,
                    p.media_asset_id AS media_asset_id
                    FROM posts AS p
                    JOIN users AS u ON u.id = p.author
                    WHERE (p.createdAt, p.id) < ($1, $2) and p.author = $3 and p.published= $4
                    ORDER BY p.createdAt DESC, p.id DESC
                    LIMIT 10 `;

      const queryWithoutCursor = `
              SELECT
                p.id AS post_id,
                p.author AS author_id,
                u.username AS author_name,
                u.profile_image AS profile_image,
                p.captions AS captions,
                p.media_url AS media_url,
                p.createdAt AS created_at,
                p.media_asset_id AS media_asset_id
                FROM posts AS p
                JOIN users AS u ON u.id = p.author
                where p.author = $1 and p.published=$2
                ORDER BY p.createdAt DESC
                LIMIT 10 `;

      const query = lastCursor ? queryWithCursor : queryWithoutCursor;
      const params = lastCursor
        ? [created_at, lastCursor, userId, published]
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
    return this.db.transaction(async (client) => {
      const isSaved = await client.query(
        `select * from bookmarks where author = $1 and post_id = $2`,
        [author, post_id],
      );

      if (isSaved.rows.length > 0) {
        await client.query(
          `delete from bookmarks where author = $1 and post_id = $2`,
          [author, post_id],
        );
        return {
          message: 'Post has been removed from your bookmarks',
        };
      } else {
        await client.query(
          `insert into bookmarks(author, post_id)
                      values($1,$2)`,
          [author, post_id],
        );
        return {
          message: 'Post saved',
        };
      }
    });
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
                  p.createdAt AS created_at,
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
