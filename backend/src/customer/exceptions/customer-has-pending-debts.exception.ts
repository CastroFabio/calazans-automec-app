import { BadRequestException } from '@nestjs/common';

export class CustomerHasPendingDebtsException extends BadRequestException {
  constructor() {
    super('Cliente ainda possui ordens de serviço pendentes de pagamento');
  }
}
