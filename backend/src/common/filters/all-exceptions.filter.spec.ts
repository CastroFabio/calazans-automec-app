import {
  ArgumentsHost,
  InternalServerErrorException,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  const log = jest.fn();
  const error = jest.fn();
  const warn = jest.fn();
  let filter: AllExceptionsFilter;
  let json: jest.Mock;
  let host: ArgumentsHost;

  beforeEach(() => {
    jest.clearAllMocks();
    const logger: LoggerService = { log, error, warn };
    filter = new AllExceptionsFilter(logger);

    json = jest.fn();
    const response = {
      locals: { requestId: 'req-123' },
      status: jest.fn().mockReturnValue({ json }),
    };
    const request = {
      method: 'GET',
      url: '/customers/search?cell=11999999999',
      originalUrl: '/customers/search?cell=11999999999',
    };
    host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost;
  });

  it('loga erros 4xx como warn, com a mensagem e sem a query string', () => {
    filter.catch(new NotFoundException('Cliente não encontrado'), host);

    expect(error).not.toHaveBeenCalled();
    const [message] = warn.mock.calls[0] as [string];
    expect(message).toContain('[req-123]');
    expect(message).toContain('Status: 404');
    expect(message).toContain('Cliente não encontrado');
    expect(message).not.toContain('11999999999');
  });

  it('loga erros 5xx como error, incluindo o stack da causa original', () => {
    const cause = new Error('P2002 Unique constraint failed');
    filter.catch(
      new InternalServerErrorException('Erro ao criar cliente', { cause }),
      host,
    );

    expect(warn).not.toHaveBeenCalled();
    const [, stack] = error.mock.calls[0] as [string, string];
    expect(stack).toContain('Caused by: Error: P2002 Unique constraint failed');
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500 }),
    );
  });

  it('trata exceções que não são HttpException como 500', () => {
    filter.catch(new Error('falha inesperada'), host);

    const [message, stack] = error.mock.calls[0] as [string, string];
    expect(message).toContain('Status: 500');
    expect(stack).toContain('falha inesperada');
  });
});
