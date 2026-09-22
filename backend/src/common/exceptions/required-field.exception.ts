import { HttpException, HttpStatus } from '@nestjs/common';

export class RequiredFieldException extends HttpException {
  constructor(fieldName: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `O campo '${fieldName}' é obrigatório e não foi fornecido.`,
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
