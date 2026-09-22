import { BadRequestException } from '@nestjs/common';

export class RequiredBodyException extends BadRequestException {
  constructor() {
    super('O corpo da requisição é obrigatório e não foi fornecido.');
  }
}
