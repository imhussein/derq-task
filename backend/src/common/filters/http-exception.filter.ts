import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception.getResponse();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(typeof error === 'string' ? { message: error } : error),
    });
  }
}
