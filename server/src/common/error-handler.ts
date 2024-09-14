import { ZodError } from 'zod'
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

@Catch(ZodError, HttpException, NotFoundException, BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        messages: exception.getResponse(),
        error: true,
        code: exception.getStatus(),
      });
    } else if (exception instanceof ZodError) {
      return response.status(400).json({
        messages: 'Invalid data',
        error: true,
        code: 400,
      });
    } else if (exception instanceof BadRequestException) {
      return response.status(exception.getStatus()).json({
        messages: exception.getResponse(),
        error: true,
        code: 400,
      });
    } else if (exception instanceof NotFoundException) {
      return response.status(404).json({
        code: 404,
        messages: 'Not found',
        error: true,
      });
    } else {
      return response.status(500).json({
        code: 500,
        messages: exception.message,
        error: true,
      });
    }
  }
}
