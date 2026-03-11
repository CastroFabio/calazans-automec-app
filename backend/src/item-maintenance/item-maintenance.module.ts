import { Module } from '@nestjs/common';
import { ItemMaintenanceService } from './item-maintenance.service';
import { ItemMaintenanceController } from './item-maintenance.controller';

@Module({
  controllers: [ItemMaintenanceController],
  providers: [ItemMaintenanceService],
})
export class ItemMaintenanceModule {}
