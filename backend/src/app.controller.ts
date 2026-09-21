import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCustomerDto } from './customer/dto/create-customer.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/teste')
  getTeste(): string {
    return this.appService.getTeste();
  }
}
