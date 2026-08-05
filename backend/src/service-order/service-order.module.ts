import { Module } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ServiceOrderController],
  providers: [ServiceOrderService, PrismaService],
  exports: [ServiceOrderService],
})
export class ServiceOrderModule {}
