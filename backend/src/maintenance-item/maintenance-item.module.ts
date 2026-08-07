import { Module } from '@nestjs/common';
import { MaintenanceItemService } from './maintenance-item.service';
import { MaintenanceItemController } from './maintenance-item.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaintenanceItemController],
  providers: [MaintenanceItemService, PrismaService],
  exports: [MaintenanceItemService],
})
export class MaintenanceItemModule {}
