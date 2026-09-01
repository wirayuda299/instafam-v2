import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService {
  pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      connectionString: this.configService.get('DATABASE_URL'),
    });
  }

  /**
   * Runs `fn` inside a BEGIN/COMMIT block on a single dedicated client.
   * Using `pool.query('begin')` directly is unsafe: each `pool.query()` call
   * can be served by a different pooled connection, so BEGIN/COMMIT/ROLLBACK
   * don't necessarily apply to the same session and writes aren't atomic.
   */
  async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
