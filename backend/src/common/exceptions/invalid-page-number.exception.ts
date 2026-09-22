import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPageNumberException extends HttpException {
  constructor(providedPage?: unknown) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `O número da página deve ser um inteiro maior ou igual a 1.${
          providedPage !== undefined ? ` Recebido: '${providedPage}'.` : ''
        }`,
        error: 'Unprocessable Entity',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
