import { ConflictException } from '@nestjs/common';

export class CustomerHasPendingDebtsException extends ConflictException {
  constructor() {
    super('Cliente ainda possui ordens de serviço pendentes de pagamento');
  }
}
