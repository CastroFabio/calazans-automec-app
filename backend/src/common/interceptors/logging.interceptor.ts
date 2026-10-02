import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import type { Request, Response } from 'express';
import { getRequestId } from '../middleware/request-id.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const { method } = request;
    // Sem query string: evita gravar dados pessoais (celular, nome buscado) no log
    const path = request.originalUrl.split('?')[0];
    const requestId = getRequestId(response);
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const now = Date.now();

    // Log de Entrada Genérico
    this.logger.log(
      `[REQ] [${requestId}] ${method} ${path} - Executando ${controllerName}.${handlerName}`,
      controllerName,
    );

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        // Log de Sucesso Genérico com Tempo de Resposta
        this.logger.log(
          `[RES] [${requestId}] ${method} ${path} - Sucesso (+${delay}ms)`,
          controllerName,
        );
      }),
    );
  }
}
