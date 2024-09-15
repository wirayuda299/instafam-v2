import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ValidationFilter } from './common/error-handler';
import { logger } from './middleware/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      allowedHeaders: ['content-type', 'Authorization', 'Cookies'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      maxAge: 5000,
    },
  });
  app.use(cookieParser());
  app.use(compression());
  app.useGlobalFilters(new ValidationFilter());
  app.use(logger())
  await app.listen(3001);
}
bootstrap();
