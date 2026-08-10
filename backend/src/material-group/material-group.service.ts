import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialGroupDto } from './dto/create-material-group.dto';
import { UpdateMaterialGroupDto } from './dto/update-material-group.dto';

@Injectable()
export class MaterialGroupService {
  constructor(private prisma: PrismaService) {}

  async countAll() {
    return await this.prisma.materialGroup.count();
  }

  // CREATE - criar um novo grupo de materiais
  async create(createMaterialGroupDto: CreateMaterialGroupDto) {
    try {
      const existingMaterialGroup = await this.prisma.materialGroup.findUnique({
        where: { group: createMaterialGroupDto.group },
      });

      if (existingMaterialGroup) {
        throw new ConflictException(
          'Já existe um grupo de materiais com este nome.',
        );
      }

      // Cria um grupo de materiais
      const materialGroup = await this.prisma.materialGroup.create({
        data: {
          group: createMaterialGroupDto.group,
        },
      });

      return materialGroup;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar grupo de materiais',
      );
    }
  }

  // READ - Buscar todos os grupos de materiais
  async findAll() {
    return this.prisma.materialGroup.findMany({
      include: {
        materials: { orderBy: { name: 'asc' } },
      },
      orderBy: {
        group: 'asc',
      },
    });
  }

  // READ - Buscar um grupo de materiais por id
  async findOne(id: number) {
    const materialGroup = await this.prisma.materialGroup.findUnique({
      where: { id },
      include: { materials: true },
    });
    if (!materialGroup)
      throw new NotFoundException('Grupo de material não encontrado');
    return materialGroup;
  }

  // READ - Buscar um grupo de materiais por nome
  async findByName(groupName: string) {
    const materialGroup = await this.prisma.materialGroup.findUnique({
      where: { group: groupName },
      include: {
        materials: true,
      },
    });

    if (!materialGroup)
      throw new NotFoundException('Grupo de materiais não encontrado');

    return materialGroup;
  }

  // UPDATE - Atualizar um grupo de materiais
  async update(id: number, updateMaterialGroupDto: UpdateMaterialGroupDto) {
    try {
      const groupMaterial = await this.prisma.materialGroup.findUnique({
        where: { id },
      });

      if (!groupMaterial)
        throw new NotFoundException('Grupo de material não encontrado');

      if (
        updateMaterialGroupDto.group &&
        updateMaterialGroupDto.group !== groupMaterial.group
      ) {
        const existingMaterialGroup =
          await this.prisma.materialGroup.findUnique({
            where: { group: updateMaterialGroupDto.group },
          });
        if (existingMaterialGroup) {
          throw new ConflictException('Este nome de grupo já está em uso');
        }
      }

      return this.prisma.materialGroup.update({
        where: { id },
        data: {
          group: updateMaterialGroupDto.group,
        },
        include: { materials: true },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar grupo de material.',
      );
    }
  }

  // DELETE - Remover um grupo de materiais
  async remove(id: number): Promise<void> {
    try {
      const materialGroup = await this.prisma.materialGroup.findUnique({
        where: { id },
      });

      if (!materialGroup)
        throw new NotFoundException('Grupo de material não encontrado');
      await this.prisma.materialGroup.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao remover grupo de material',
      );
    }
  }
}
