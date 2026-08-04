import { Module } from '@nestjs/common';
import { MaterialGroupController } from './material-group.controller';
import { MaterialGroupService } from './material-group.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaterialGroupController],
  providers: [MaterialGroupService, PrismaService],
  exports: [MaterialGroupService],
})
export class MaterialGroupModule {}
