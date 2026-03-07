import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaterialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMaterialDto: CreateMaterialDto) {
    const material = await this.prisma.material.findUnique({
      where: {
        name: createMaterialDto.name,
      },
    });

    if (material) {
      throw new HttpException(
        'Material already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newMaterial = await this.prisma.material.create({
      data: { ...createMaterialDto },
    });

    return newMaterial;
  }

  async findAll() {
    const material = await this.prisma.material.findMany();
    return material;
  }

  async findOne(@Param('id') id: number) {
    if (!id) {
      throw new Error('Material ID is required');
    }

    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new HttpException('Material not found', HttpStatus.NOT_FOUND);
    }

    return material;
  }

  async update(id: number, updateMaterialDto: UpdateMaterialDto) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new HttpException('Material not found', HttpStatus.NOT_FOUND);
    }

    if (updateMaterialDto.name) {
      const cellExists = await this.prisma.material.findFirst({
        where: { name: updateMaterialDto.name, NOT: { id } },
      });
      if (cellExists) {
        throw new HttpException(
          'Name phone already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updateService = await this.prisma.material.update({
      where: { id },
      data: { ...updateMaterialDto },
    });
    return updateService;
  }

  async remove(id: number) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new HttpException('Material not found', HttpStatus.NOT_FOUND);
    }

    const deleteMaterial = await this.prisma.material.delete({
      where: { id },
    });

    return deleteMaterial;
  }
}
