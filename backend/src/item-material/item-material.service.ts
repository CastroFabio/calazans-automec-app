import { Injectable } from '@nestjs/common';
import { CreateItemMaterialDto } from './dto/create-item-material.dto';
import { UpdateItemMaterialDto } from './dto/update-item-material.dto';

@Injectable()
export class ItemMaterialService {
  create(createItemMaterialDto: CreateItemMaterialDto) {
    return 'This action adds a new itemMaterial';
  }

  findAll() {
    return `This action returns all itemMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemMaterial`;
  }

  update(id: number, updateItemMaterialDto: UpdateItemMaterialDto) {
    return `This action updates a #${id} itemMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemMaterial`;
  }
}
