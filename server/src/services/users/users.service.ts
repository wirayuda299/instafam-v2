import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { createUserSchema, CreateUserType } from 'src/common/validation';

type User = {
  id: string;
  username: string;
  email: string;
  profile_image: string;
};

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) { }

  async createUser(values: CreateUserType) {
    try {
      const validatedValue = createUserSchema.safeParse(values);
      if (!validatedValue.success) {
        throw new BadRequestException('Please add valid value', {
          cause: 'Data not valid',
        });
      }

      const { id, username, email, image } = validatedValue.data;

      await this.db.pool.query(`begin`)
      await this.db.pool.query(
        `insert into users(id, email, username, profile_image)
        values($1,$2,$3,$4)`,
        [id, email, username, image],
      );

      await this.db.pool.query(`insert into user_settings (userId) values($1)`, [id])
      await this.db.pool.query(`commit`)

      return {
        messages: 'User created',
        error: false,
      };
    } catch (error) {
      await this.db.pool.query(`rollback`)

      throw error;
    }
  }

  async searchUser(query: string): Promise<User[]> {
    try {

      if(!query) {
        throw new BadRequestException("username is required")
      }

      const users = await this.db.pool.query(
        `
            select
            id,
            username,
            email,
            profile_image
            from users where username @@ to_tsquery($1)`,
        [query],
      );

      return users.rows;
    } catch (e) {
      throw e;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.db.pool.query(
        `select * from users where id = $1`,
        [id],
      );

      if (user.rows.length < 0) {
        return new NotFoundException('User not found');
      }

      const userSettings= await this.db.pool.query(`select * from user_settings where userId= $1`, [user.rows[0].id])

      user.rows[0].settings= userSettings.rows[0]

      return user.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getUserFollowers(userId: string): Promise<{ follower_id: string }[]> {
    try {
      const followers = await this.db.pool.query(
        `select follower_id from followers where user_id = $1`,
        [userId],
      );
      return followers.rows;
    } catch (e) {
      throw e;
    }
  }

  async getUserFollowing(userId: string): Promise<{ follower_id: string }[]> {
    try {
      const followings = await this.db.pool.query(
        `select following_id from following where user_id = $1`,
        [userId],
      );
      return followings.rows;
    } catch (e) {
      throw e;
    }
  }

  async followOrUnfollow(userToFollow: string, currentUser: string) {
    try {
      const followers = await this.getUserFollowers(userToFollow);
      const isFollowed = followers.find(
        (follower) => follower.follower_id === currentUser,
      );

      await this.db.pool.query(`begin`);

      if (isFollowed) {
        await this.db.pool.query(
          `delete from followers where follower_id = $1 and user_id = $2`,
          [currentUser, userToFollow],
        );
        await this.db.pool.query(
          `delete from following where user_id = $1 and following_id = $2`,
          [currentUser, userToFollow],
        );
      } else {
        await this.db.pool.query(
          `insert into followers(user_id, follower_id) values($1,$2)`,
          [userToFollow, currentUser],
        );
        await this.db.pool.query(
          `insert into following(user_id, following_id) values($1,$2)`,
          [currentUser, userToFollow],
        );
      }
      await this.db.pool.query(`commit`);
    } catch (e) {
      await this.db.pool.query(`rollback`);

      throw e;
    }
  }

  async getUsers(userId: string, limit: number = 8) {
    try {
      const queryWithLimit = `select * from users where id != $1 limit $2 `;
      const queryWithoutLimit = `select * from users where id != $1`;

      const query = limit === 0 ? queryWithoutLimit : queryWithLimit;
      const params = limit !== 0 ? [userId, limit] : [userId];

      const users = await this.db.pool.query(query, params);

      return users.rows;
    } catch (error) {
      throw error;
    }
  }
}
