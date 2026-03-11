import { Injectable } from '@nestjs/common';
import { CreateItemMaintenanceDto } from './dto/create-item-maintenance.dto';
import { UpdateItemMaintenanceDto } from './dto/update-item-maintenance.dto';

@Injectable()
export class ItemMaintenanceService {
  create(createItemMaintenanceDto: CreateItemMaintenanceDto) {
    return 'This action adds a new itemMaintenance';
  }

  findAll() {
    return `This action returns all itemMaintenance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemMaintenance`;
  }

  update(id: number, updateItemMaintenanceDto: UpdateItemMaintenanceDto) {
    return `This action updates a #${id} itemMaintenance`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemMaintenance`;
  }
}
