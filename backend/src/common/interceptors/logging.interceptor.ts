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

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const now = Date.now();

    // Log de Entrada Genérico
    this.logger.log(
      `[REQ] ${method} ${url} - Executando ${controllerName}.${handlerName}`,
      controllerName,
    );

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        // Log de Sucesso Genérico com Tempo de Resposta
        this.logger.log(
          `[RES] ${method} ${url} - Sucesso (+${delay}ms)`,
          controllerName,
        );
      }),
    );
  }
}
