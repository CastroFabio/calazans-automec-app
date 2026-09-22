import { HttpException, HttpStatus } from '@nestjs/common';

export class ValueMustBeGreaterThanZeroException extends HttpException {
  constructor(propertyName: string) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `O campo '${propertyName}' deve ser um valor maior que zero.`,
        error: 'Unprocessable Entity',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
