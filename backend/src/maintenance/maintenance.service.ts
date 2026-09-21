import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Criar um manutenção
  async create(createMaintenanceDto: CreateMaintenanceDto) {
    try {
      const existingMaintenance = await this.prisma.maintenanceJob.findUnique({
        where: { name: createMaintenanceDto.name },
      });

      if (existingMaintenance)
        throw new ConflictException('Já existe um manutenção com esse nome');

      if (createMaintenanceDto.group_id) {
        const maintenanceGroup =
          await this.prisma.maintenanceJobGroup.findUnique({
            where: { id: createMaintenanceDto.group_id },
          });

        if (!maintenanceGroup)
          throw new ConflictException('Grupo de manutenção não encontrado');
      }

      const maintenance = await this.prisma.maintenanceJob.create({
        data: {
          name: createMaintenanceDto.name,
          group_id: createMaintenanceDto.group_id,
        },
      });

      return maintenance;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar manutenção');
    }
  }

  // READ - Buscar todas as manutenções
  async findAll() {
    return this.prisma.maintenanceJob.findMany({ orderBy: { id: 'asc' } });
  }

  // UPDATE - Atualiza uma manutenção
  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    try {
      const maintenance = await this.prisma.maintenanceJob.findUnique({
        where: { id },
      });

      if (!maintenance)
        throw new NotFoundException('Manutenação não encontrada');

      if (
        updateMaintenanceDto.name &&
        updateMaintenanceDto.name !== maintenance.name
      ) {
        const existingMaintenance = await this.prisma.maintenanceJob.findUnique(
          {
            where: { name: updateMaintenanceDto.name },
          },
        );

        if (existingMaintenance) {
          throw new ConflictException('Este nome de manutenção já está em uso');
        }
      }

      if (updateMaintenanceDto.group_id) {
        const maintenanceGroup =
          await this.prisma.maintenanceJobGroup.findUnique({
            where: { id: updateMaintenanceDto.group_id },
          });

        if (!maintenanceGroup)
          throw new NotFoundException('Grupo de manutenção não encontrado');
      }

      return this.prisma.maintenanceJob.update({
        where: { id },
        data: {
          name: updateMaintenanceDto.name,
          group_id: updateMaintenanceDto.group_id,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar manutenção');
    }
  }

  // DELETE - Remover uma manutenção
  async remove(id: number): Promise<void> {
    try {
      const maintenance = await this.prisma.maintenanceJob.findUnique({
        where: { id },
      });

      if (!maintenance)
        throw new NotFoundException('Manutenção não encontrada');

      await this.prisma.maintenanceJob.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover manutenção');
    }
  }
}
