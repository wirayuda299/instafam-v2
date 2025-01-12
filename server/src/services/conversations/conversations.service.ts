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
    } catch (error) {
      throw new HttpException('Failed to get conversations', HttpStatus.INTERNAL_SERVER_ERROR);
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
        throw new HttpException('You are not allowed to edit this message', HttpStatus.UNAUTHORIZED);
      }

      const message = await this.db.pool.query(`SELECT * FROM messages WHERE id = $1`, [messageId]);

      if (message.rows.length < 1) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
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
    } catch (error) {
      throw new HttpException('Failed to update message', HttpStatus.INTERNAL_SERVER_ERROR);
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
        parent_id,
        image_url,
        userId,
        image_asset_id,
      } = validatedValue.data;

      await this.db.pool.query('BEGIN');

      const currentConversations = await this.getUserConversations(userId);
      if (currentConversations.length > 0) {
        // Send the message if the conversation already exists
        await this.send({
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
        } = await this.db.pool.query(
          `INSERT INTO conversations (sender_id, recipient_id)
           VALUES ($1, $2)
           RETURNING id`,
          [userId, recipient_id],
        );

        await this.send({
          userId,
          conversationId: conversation.id,
          image_asset_id,
          image_url,
          message,
          parent_id: parent_id || null,
          recipient_id,
        });
      }

      await this.db.pool.query('COMMIT');
    } catch (error) {
      await this.db.pool.query('ROLLBACK');
      throw new HttpException('Failed to send message', HttpStatus.INTERNAL_SERVER_ERROR);
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
        parent_id,
        image_url,
        userId,
        image_asset_id,
      } = validatedValue.data;
      console.log(validatedValue.data)

      await this.db.pool.query(
        `INSERT INTO messages("content", author, attachment_url, attachment_id, conversation_id, parent_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [message, userId, image_url, image_asset_id, conversationId, parent_id || null],
      );
    } catch (e) {
      console.log(e)
      throw new HttpException('Failed to send message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    } catch (error) {
      throw new HttpException('Failed to retrieve messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
