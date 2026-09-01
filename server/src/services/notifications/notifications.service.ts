import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { SocketGateway } from 'src/gateway/socket/socket.gateway';
import { Notification, NotificationType } from 'src/types';

@Injectable()
export class NotificationsService {
  constructor(
    private db: DatabaseService,
    private gateway: SocketGateway,
  ) {}

  // Best-effort side effect: a failure here shouldn't fail the like/comment/
  // follow action that triggered it, so errors are swallowed and logged.
  async notify(
    recipientId: string,
    actorId: string,
    type: NotificationType,
    postId?: string,
  ) {
    if (recipientId === actorId) return;

    try {
      await this.db.pool.query(
        `insert into notifications(recipient_id, actor_id, type, post_id) values($1,$2,$3,$4)`,
        [recipientId, actorId, type, postId ?? null],
      );
      this.gateway.server.to(recipientId).emit('new_notification');
    } catch (error) {
      console.log('Failed to create notification', error);
    }
  }

  async getForUser(userId: string): Promise<Notification[]> {
    const { rows } = await this.db.pool.query(
      `select
        n.id,
        n.type,
        n.post_id,
        n.is_read,
        n.created_at,
        n.actor_id,
        u.username as actor_username,
        u.profile_image as actor_image
      from notifications n
      join users u on u.id = n.actor_id
      where n.recipient_id = $1
      order by n.created_at desc
      limit 30`,
      [userId],
    );
    return rows;
  }

  async markAllRead(userId: string) {
    await this.db.pool.query(
      `update notifications set is_read = true where recipient_id = $1`,
      [userId],
    );
    return { message: 'Notifications marked as read' };
  }
}
