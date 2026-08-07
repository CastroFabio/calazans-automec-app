import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceGroupDto } from './dto/create-maintenance-group.dto';
import { UpdateMaintenanceGroupDto } from './dto/update-maintenance-group.dto';

@Injectable()
export class MaintenanceGroupService {
  constructor(private prisma: PrismaService) {}

  // CREATE - criar um novo grupo de manutenção
  async create(createMaintenanceGroupDto: CreateMaintenanceGroupDto) {
    try {
      const existingMaintenanceGroup =
        await this.prisma.maintenanceJobGroup.findUnique({
          where: { group: createMaintenanceGroupDto.group },
        });

      if (existingMaintenanceGroup) {
        throw new ConflictException(
          'Já existe um grupo de manutenção com este nome.',
        );
      }

      // Cria um grupo de manutenção
      const maintenanceJobGroup = await this.prisma.maintenanceJobGroup.create({
        data: {
          group: createMaintenanceGroupDto.group,
        },
      });

      return maintenanceJobGroup;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar grupo de manutenção',
      );
    }
  }

  // READ - Buscar todos os grupos de manutenção
  async findAll() {
    return this.prisma.maintenanceJobGroup.findMany({
      include: {
        maintenanceJobs: { orderBy: { name: 'asc' } },
      },
      orderBy: {
        group: 'asc',
      },
    });
  }

  // READ - Buscar um grupo de manutenção por id
  async findOne(id: number) {
    const maintenanceJobGroup =
      await this.prisma.maintenanceJobGroup.findUnique({
        where: { id },
        include: { maintenanceJobs: true },
      });
    if (!maintenanceJobGroup)
      throw new NotFoundException('Grupo de manutenção não encontrado');
    return maintenanceJobGroup;
  }

  // READ - Buscar um grupo de manutenção por nome
  async findByName(groupName: string) {
    const maintenanceJobGroup =
      await this.prisma.maintenanceJobGroup.findUnique({
        where: { group: groupName },
        include: {
          maintenanceJobs: true,
        },
      });

    if (!maintenanceJobGroup)
      throw new NotFoundException('Grupo de manutenção não encontrado');

    return maintenanceJobGroup;
  }

  // UPDATE - Atualizar um grupo de manutenção
  async update(
    id: number,
    updateMaintenanceGroupDto: UpdateMaintenanceGroupDto,
  ) {
    try {
      const groupMaterial = await this.prisma.maintenanceJobGroup.findUnique({
        where: { id },
      });

      if (!groupMaterial)
        throw new NotFoundException('Grupo de material não encontrado');

      if (
        updateMaintenanceGroupDto.group &&
        updateMaintenanceGroupDto.group !== groupMaterial.group
      ) {
        const existingMaintenanceGroup =
          await this.prisma.maintenanceJobGroup.findUnique({
            where: { group: updateMaintenanceGroupDto.group },
          });
        if (existingMaintenanceGroup) {
          throw new ConflictException('Este nome de grupo já está em uso');
        }
      }

      return this.prisma.maintenanceJobGroup.update({
        where: { id },
        data: {
          group: updateMaintenanceGroupDto.group,
        },
        include: { maintenanceJobs: true },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar grupo de manutenção.',
      );
    }
  }

  // DELETE - Remover um grupo de manutenção
  async remove(id: number): Promise<void> {
    try {
      const maintenanceJobGroup =
        await this.prisma.maintenanceJobGroup.findUnique({
          where: { id },
        });

      if (!maintenanceJobGroup)
        throw new NotFoundException('Grupo de material não encontrado');
      await this.prisma.maintenanceJobGroup.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao remover grupo de manutenção',
      );
    }
  }
}
