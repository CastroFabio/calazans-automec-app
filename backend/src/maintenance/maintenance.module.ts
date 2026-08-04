import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaintenanceController],
  providers: [MaintenanceService, PrismaService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
