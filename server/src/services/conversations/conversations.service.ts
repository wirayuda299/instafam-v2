import {
  HttpException,
  Injectable,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { PoolClient } from 'pg';

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
  constructor(private db: DatabaseService) {}

  async getUserConversations(userId: string): Promise<UserConversation[]> {
    try {
      const conversationsQuery = `
        SELECT
          c.id AS "conversationId",
          u_sender.id AS "senderId",
          u_sender.username AS "senderUsername",
          u_sender.profile_image AS "senderImage",
          u_recipient.id AS "recipientId",
          u_recipient.username AS "recipientUsername",
          u_recipient.profile_image AS "recipientImage"
        FROM conversations AS c
        JOIN users AS u_sender ON u_sender.id = c.sender_id
        JOIN users AS u_recipient ON u_recipient.id = c.recipient_id
        WHERE c.sender_id = $1 OR c.recipient_id = $1`;

      const { rows } = await this.db.pool.query(conversationsQuery, [userId]);
      return rows;
    } catch {
      throw new HttpException(
        'Failed to get conversations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editMessage(currentUser: string, messageId: string, content: string) {
    const { rows } = await this.db.pool.query(
      `SELECT * FROM messages WHERE id = $1`,
      [messageId],
    );
    const message = rows[0];

    if (!message) {
      throw new NotFoundException('Message not found');
    }
    if (message.author !== currentUser) {
      throw new HttpException(
        'You are not allowed to edit this message',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.db.pool.query(
      `UPDATE messages
         SET content = $1, updated_at = NOW()
         WHERE id = $2`,
      [content, messageId],
    );

    return {
      message: 'Message updated successfully',
      error: false,
    };
  }

  async sendPersonalMessage(data: SendMessageSchema) {
    const validatedValue = sendMessageSchema.safeParse(data);
    if (!validatedValue.success) {
      throw new BadRequestException('Data is not valid');
    }

    const {
      message,
      recipient_id,
      parent_id,
      image_url,
      userId,
      image_asset_id,
    } = validatedValue.data;

    try {
      await this.db.transaction(async (client) => {
        const currentConversations = await this.getUserConversations(userId);
        if (currentConversations.length > 0) {
          // Send the message if the conversation already exists
          await this.send(client, {
            conversationId: currentConversations[0].conversationId,
            image_asset_id,
            image_url,
            message,
            parent_id: parent_id || null,
            recipient_id,
            userId,
          });
        } else {
          // Create a new conversation if it doesn't exist
          const {
            rows: [conversation],
          } = await client.query(
            `INSERT INTO conversations (sender_id, recipient_id)
           VALUES ($1, $2)
           RETURNING id`,
            [userId, recipient_id],
          );

          await this.send(client, {
            userId,
            conversationId: conversation.id,
            image_asset_id,
            image_url,
            message,
            parent_id: parent_id || null,
            recipient_id,
          });
        }
      });
    } catch {
      throw new HttpException(
        'Failed to send message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async send(client: PoolClient, data: SendMessageSchema) {
    const validatedValue = sendMessageSchema.safeParse(data);
    if (!validatedValue.success) {
      throw new BadRequestException('Data is not valid');
    }

    const {
      conversationId,
      message,
      parent_id,
      image_url,
      userId,
      image_asset_id,
    } = validatedValue.data;

    await client.query(
      `INSERT INTO messages("content", author, attachment_url, attachment_id, conversation_id, parent_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
      [
        message,
        userId,
        image_url,
        image_asset_id,
        conversationId,
        parent_id || null,
      ],
    );
  }

  async getPersonalMessage(userId: string | null) {
    try {
      const conversations = await this.getUserConversations(userId);

      if (conversations.length === 0) {
        return [];
      }

      const allMessages = [];

      for (const conversation of conversations) {
        const baseMessages = await this.db.pool.query(
          `WITH RECURSIVE message_tree AS (
            SELECT 
              m.id, 
              m.content as message, 
              m.attachment_url, 
              m.attachment_id, 
              m.parent_id, 
              u.username,
              u.profile_image,
              m.createdAt as created_at,
              m.updatedAt as updated_at,
              m.author, 
              0 AS level  
            FROM messages as m
            JOIN users as u on u.id = m.author
            WHERE (m.conversation_id = $1) AND m.parent_id IS NULL  
            UNION ALL
            SELECT 
              m.id, 
              m.content as message, 
              m.attachment_url, 
              m.attachment_id, 
              m.parent_id, 
              u.username,
              u.profile_image,
              m.createdAt as created_at,
              m.updatedAt as updated_at,
              m.author, 
              mt.level + 1 AS level  
            FROM 
              messages as m
            JOIN users as u on u.id = m.author
            INNER JOIN message_tree mt ON m.parent_id = mt.id
            WHERE m.conversation_id = $1)
          SELECT * FROM message_tree
          ORDER BY message_tree.created_at ASC`,
          [conversation.conversationId],
        );

        allMessages.push(...baseMessages.rows);
      }

      return allMessages;
    } catch {
      throw new HttpException(
        'Failed to retrieve messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
