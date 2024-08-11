import {
  HttpException,
  Injectable,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { SendMessageSchema, sendMessageSchema } from '../../common/validation';

type UserConversation = {
  conversationId: string;
  conversationCreatedAt: string;
  senderId: string;
  senderUsername: string;
  senderImage: string;
  recipientId: string;
  recipientUsername: string;
  recipientImage: string;
};

@Injectable()
export class ConversationsService {
  constructor(private db: DatabaseService) { }

  async getUserConversations(userId: string): Promise<UserConversation[]> {
    try {
      const conversationsQuery = `
            SELECT
            c.id AS "conversationId",
            c.created_at AS "conversationCreatedAt",
            u_sender.id AS "senderId",
            u_sender.username AS "senderUsername",
            u_sender.profile_image AS "senderImage",
            u_recipient.id AS "recipientId",
            u_recipient.username AS "recipientUsername",
            u_recipient.profile_image AS "recipientImage"
            FROM conversations AS c
            JOIN users AS u_sender ON u_sender.id = c.sender_id
            JOIN users AS u_recipient ON u_recipient.id = c.recipient_id
            WHERE c.sender_id = $1
            OR c.recipient_id = $1`;

      const { rows } = await this.db.pool.query(conversationsQuery, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async editMessage(
    messageAuthor: string,
    currentUser: string,
    messageId: string,
    content: string,
  ) {
    try {
      if (messageAuthor !== currentUser) {
        throw new HttpException(
          'You are not allowed to edit this message',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.db.pool.query(`begin`)
      const message = await this.db.pool.query(
        `select * from messages where id = $1`,
        [messageId],
      );

      if (message.rows.length < 1) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }
      await this.db.pool.query(
        `update messages
          set content = $1,
          updated_at = NOW()
          where id = $2`,
        [content, messageId],
      );
      await this.db.pool.query(`commit`)
      return {
        message: 'Message updated',
        error: false,
      };
    } catch (error) {
      await this.db.pool.query(`rollback`)
      throw error;
    }
  }

  async sendPersonalMessage(data: SendMessageSchema) {
    try {
      const validatedValue = sendMessageSchema.safeParse(data);

      if (!validatedValue.success) {
        throw new BadRequestException('Data is not valid');
      }

      const {
        conversationId,
        message,
        recipient_id,
        sendedBy,
        parent_id,
        attachmentId,
        attachmentUrl,
      } = validatedValue.data;

      await this.db.pool.query(`BEGIN`);
      const currentConversations = await this.getUserConversations(sendedBy);

      if (currentConversations.length > 0) {
        await this.send({
          sendedBy,
          conversationId,
          attachmentId,
          attachmentUrl,
          message,
          parent_id,
          recipient_id,
        });
      } else {
        const {
          rows: [conversation],
        } = await this.db.pool.query(
          `INSERT INTO conversations (sender_id, recipient_id)
           VALUES ($1, $2)
           RETURNING id`,
          [sendedBy],
        );
        await this.send({
          sendedBy,
          conversationId: conversation.rows[0].id,
          attachmentId,
          attachmentUrl,
          message,
          parent_id,
          recipient_id,
        });
      }

      await this.db.pool.query(`COMMIT`);
    } catch (error) {
      await this.db.pool.query(`ROLLBACK`);
      throw error;
    }
  }

  async send(data: SendMessageSchema) {
    try {
      const validatedValue = sendMessageSchema.safeParse(data);

      if (!validatedValue.success) {
        throw new BadRequestException('Data is not valid');
      }

      const {
        conversationId,
        message,
        sendedBy,
        parent_id,
        attachmentId,
        attachmentUrl,
      } = validatedValue.data;

      await this.db.pool.query(
        `INSERT INTO messages("content", user_id, image_url, image_asset_id, conversation_id, parent_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          message,
          sendedBy,
          attachmentUrl,
          attachmentId,
          conversationId,
          parent_id,
        ],
      );
    } catch (e) {
      throw e;
    }
  }

  async fetchReplies(
    messageId: string,
    messages: any[],
    conversationId: string,
  ) {
    const replies = await this.db.pool.query(
      `SELECT
          mr.parent_message_id as parent_message_id,
          mr.id as reply_id,
          mr.author as author_id,
          m."content" as message,
          m.id as message_id,
          m.is_read as is_read,
          m.user_id as author,
          m.image_url as media_image,
          m.image_asset_id as media_image_asset_id,
          m.created_at as created_at,
          m.updated_at as update_at,
          u.username as username,
          u.profile_image as profile_image
          FROM messages_replies as mr
          JOIN messages as m ON m.id = mr.message_id
          JOIN users as u on u.id = m.user_id
          WHERE mr.parent_message_id = $1
          ORDER BY m.created_at ASC`,
      [messageId],
    );

    for await (const reply of replies.rows) {
      reply.conversation_id = conversationId;
      messages.push(reply);
      await this.fetchReplies(reply.message_id, messages, conversationId);
    }
  }

  async getPersonalMessage(userId: string | null) {
    try {
      const messages = [];
      const conversations = await this.getUserConversations(userId);

      const baseMessages = await this.db.pool.query(
        `SELECT
          m.conversation_id,
          m.content AS message,
          m.is_read AS is_read,
          m.user_id AS author,
          m.id as message_id,
          m.image_url AS media_image,
          m.image_asset_id AS media_image_asset_id,
          m.created_at AS created_at,
          m.updated_at AS update_at,
          u.username AS username,
          u.profile_image as profile_image
          from messages as m
          JOIN users AS u ON u.id = m.user_id
          WHERE m.conversation_id = $1
          OR m.user_id = COALESCE($2, m.user_id)`,
        [conversations[0].conversationId, userId],
      );

      for await (const message of baseMessages.rows) {
        messages.push(message);
        await this.fetchReplies(
          message.message_id,
          messages,
          message.conversation_id,
        );
      }

      messages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      return messages;
    } catch (error) {
      throw error;
    }
  }
}
