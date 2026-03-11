import { Module } from '@nestjs/common';
import { ItemMaterialService } from './item-material.service';
import { ItemMaterialController } from './item-material.controller';

@Module({
  controllers: [ItemMaterialController],
  providers: [ItemMaterialService],
})
export class ItemMaterialModule {}
