import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Criar um material
  async create(createMaterialDto: CreateMaterialDto) {
    try {
      const existingMaterial = await this.prisma.material.findUnique({
        where: { name: createMaterialDto.name },
      });

      if (existingMaterial)
        throw new ConflictException('Já existe um material com esse nome');

      if (createMaterialDto.group_id) {
        const materialGroup = await this.prisma.materialGroup.findUnique({
          where: { id: createMaterialDto.group_id },
        });

        if (!materialGroup)
          throw new ConflictException('Grupo de material não encontrado');
      }

      const material = await this.prisma.material.create({
        data: {
          name: createMaterialDto.name,
          group_id: createMaterialDto.group_id,
        },
      });

      return material;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar material');
    }
  }

  // READ - Buscar todos os materiais
  async findAll() {
    return this.prisma.material.findMany({ orderBy: { id: 'asc' } });
  }

  // UPDATE - Atualiza um material
  async update(id: number, updateMaterialDto: UpdateMaterialDto) {
    try {
      const material = await this.prisma.material.findUnique({
        where: { id },
      });

      if (!material) throw new NotFoundException('Material não encontrado');

      if (updateMaterialDto.name && updateMaterialDto.name !== material.name) {
        const existingMaterial = await this.prisma.material.findUnique({
          where: { name: updateMaterialDto.name },
        });

        if (existingMaterial) {
          throw new ConflictException('Este nome de material já está em uso');
        }
      }

      if (updateMaterialDto.group_id) {
        const materialGroup = await this.prisma.materialGroup.findUnique({
          where: { id: updateMaterialDto.group_id },
        });

        if (!materialGroup)
          throw new NotFoundException('Grupo de material não encontrado');
      }

      return this.prisma.material.update({
        where: { id },
        data: {
          name: updateMaterialDto.name,
          group_id: updateMaterialDto.group_id,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar material');
    }
  }

  // DELETE - Remover um material
  async remove(id: number): Promise<void> {
    try {
      const material = await this.prisma.material.findUnique({
        where: { id },
      });

      if (!material) throw new NotFoundException('Material não encontrado');

      await this.prisma.material.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover material');
    }
  }
}
