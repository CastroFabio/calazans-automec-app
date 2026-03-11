import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemMaintenanceService } from './item-maintenance.service';
import { CreateItemMaintenanceDto } from './dto/create-item-maintenance.dto';
import { UpdateItemMaintenanceDto } from './dto/update-item-maintenance.dto';

@Controller('item-maintenance')
export class ItemMaintenanceController {
  constructor(private readonly itemMaintenanceService: ItemMaintenanceService) {}

  @Post()
  create(@Body() createItemMaintenanceDto: CreateItemMaintenanceDto) {
    return this.itemMaintenanceService.create(createItemMaintenanceDto);
  }

  @Get()
  findAll() {
    return this.itemMaintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemMaintenanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemMaintenanceDto: UpdateItemMaintenanceDto) {
    return this.itemMaintenanceService.update(+id, updateItemMaintenanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMaintenanceService.remove(+id);
  }
}
