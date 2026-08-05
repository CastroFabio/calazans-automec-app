import { Module } from '@nestjs/common';
import { MaterialItemService } from './material-item.service';
import { MaterialItemController } from './material-item.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaterialItemController],
  providers: [MaterialItemService, PrismaService],
  exports: [MaterialItemService],
})
export class MaterialItemModule {}
