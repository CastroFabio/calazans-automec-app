import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, PrismaService],
  exports: [MaterialService],
})
export class MaterialModule {}
