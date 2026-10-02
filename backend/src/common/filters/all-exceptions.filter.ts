import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import type { Request, Response } from 'express';
import { getRequestId } from '../middleware/request-id.middleware';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    // Sem query string: evita gravar dados pessoais (celular, nome buscado) no log
    const path = request.originalUrl.split('?')[0];
    const summary = `[ERR] [${getRequestId(response)}] ${request.method} ${path} - Status: ${status}`;

    if (status >= 500) {
      // Erro do servidor: loga o stack da causa original (ex.: erro do Prisma),
      // não só o da InternalServerErrorException que a embrulhou
      this.logger.error(summary, this.buildStack(exception), 'HTTPException');
    } else {
      // Erro do cliente (400, 401, 404...): é esperado, não vai para o log de erros
      const detail =
        typeof message === 'string' ? message : JSON.stringify(message);
      this.logger.warn(`${summary} - ${detail}`, 'HTTPException');
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private buildStack(exception: unknown): string | undefined {
    if (!(exception instanceof Error)) {
      return JSON.stringify(exception);
    }

    const { cause } = exception;
    if (cause === undefined) {
      return exception.stack;
    }

    const causeStack =
      cause instanceof Error ? cause.stack : JSON.stringify(cause);
    return `${exception.stack}\nCaused by: ${causeStack}`;
  }
}
