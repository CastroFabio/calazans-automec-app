import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidStringPropertyException extends HttpException {
  constructor(propertyName: string) {
    super(
      `A propriedade '${propertyName}' precisa ser uma string válida.`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
