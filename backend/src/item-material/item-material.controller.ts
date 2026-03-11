import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemMaterialService } from './item-material.service';
import { CreateItemMaterialDto } from './dto/create-item-material.dto';
import { UpdateItemMaterialDto } from './dto/update-item-material.dto';

@Controller('item-material')
export class ItemMaterialController {
  constructor(private readonly itemMaterialService: ItemMaterialService) {}

  @Post()
  create(@Body() createItemMaterialDto: CreateItemMaterialDto) {
    return this.itemMaterialService.create(createItemMaterialDto);
  }

  @Get()
  findAll() {
    return this.itemMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemMaterialDto: UpdateItemMaterialDto) {
    return this.itemMaterialService.update(+id, updateItemMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMaterialService.remove(+id);
  }
}
