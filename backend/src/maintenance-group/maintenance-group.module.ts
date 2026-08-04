import { Module } from '@nestjs/common';
import { MaintenanceGroupService } from './maintenance-group.service';
import { MaintenanceGroupController } from './maintenance-group.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaintenanceGroupController],
  providers: [MaintenanceGroupService, PrismaService],
  exports: [MaintenanceGroupService],
})
export class MaintenanceGroupModule {}
