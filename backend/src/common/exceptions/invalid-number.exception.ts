import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidNumberPropertyException extends HttpException {
  constructor(propertyName: string) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `A propriedade '${propertyName}' precisa ser um number válido.`,
        error: 'Unprocessable Entity',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
