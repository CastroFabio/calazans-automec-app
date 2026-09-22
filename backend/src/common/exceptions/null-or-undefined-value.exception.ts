import { HttpException, HttpStatus } from '@nestjs/common';

export class NullOrUndefinedValueException extends HttpException {
  constructor(propertyName: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `A propriedade '${propertyName}' não pode ser nula ou indefinida.`,
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
