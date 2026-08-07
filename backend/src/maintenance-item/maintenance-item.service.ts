import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaintenanceItemDto } from './dto/create-maintenance-item.dto';
import { UpdateMaintenanceDto } from 'src/maintenance/dto/update-maintenance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMaintenanceItemDto } from './dto/update-maintenance-item.dto';

@Injectable()
export class MaintenanceItemService {
  constructor(private prisma: PrismaService) {}

  async existsMaintenanceInOrder(
    serviceOrderId: number,
    maintenanceId: number,
  ): Promise<boolean> {
    const count = await this.prisma.itemMaintenance.count({
      where: {
        serviceorder_id: serviceOrderId,
        maintenance_id: maintenanceId,
      },
    });
    return count > 0;
  }

  // CREATE - Criar um serviço de manutenção
  async create(createMaintenanceItemDto: CreateMaintenanceItemDto) {
    try {
      if (createMaintenanceItemDto.maintenance_id) {
        const maintenance = await this.prisma.maintenanceJob.findUnique({
          where: { id: createMaintenanceItemDto.maintenance_id },
        });
        if (!maintenance)
          throw new ConflictException('Serviço de manutenção não encontrado');
      }

      if (createMaintenanceItemDto.serviceorder_id) {
        const serviceOrder = await this.prisma.serviceOrder.findUnique({
          where: { id: createMaintenanceItemDto.serviceorder_id },
        });
        if (!serviceOrder)
          throw new ConflictException('Ordem de serviço não encontrado');
      }

      const exists = await this.existsMaintenanceInOrder(
        createMaintenanceItemDto.serviceorder_id,
        createMaintenanceItemDto.maintenance_id,
      );
      if (exists) {
        throw new ConflictException(
          `Essa ordem de serviço já possui um serviço de manutenção.`,
        );
      }

      const maintenanceItem = await this.prisma.itemMaintenance.create({
        data: {
          value_unity: createMaintenanceItemDto.value_unity,
          serviceorder_id: createMaintenanceItemDto.serviceorder_id,
          maintenance_id: createMaintenanceItemDto.maintenance_id,
          description: createMaintenanceItemDto.description,
        },
      });

      return maintenanceItem;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar serviço de manutenção',
      );
    }
  }

  // READ - Buscar todos os itens de maintenance
  async findAll() {
    return this.prisma.itemMaintenance.findMany();
  }

  // READ - Buscar um serviço de manutenção por ID
  async findOne(id: number) {
    const maintenanceItem = await this.prisma.itemMaintenance.findUnique({
      where: { id },
      include: { maintenancejob: true },
    });

    if (!maintenanceItem)
      throw new NotFoundException('serviço de manutenção não encontrado');

    return maintenanceItem;
  }

  // UPDATE - Atualizar um serviço de manutenção
  async update(id: number, updateMaintenanceItemDto: UpdateMaintenanceItemDto) {
    try {
      // 1. Buscar o item atual
      const itemMaintenance = await this.prisma.itemMaintenance.findUnique({
        where: { id },
      });

      if (!itemMaintenance) {
        throw new NotFoundException('serviço de manutenção não encontrado');
      }

      // 2. Verificar se está tentando alterar o maintenance ou a OS
      // Se NÃO está alterando maintenance_id OU serviceorder_id, pula a verificação
      if (
        updateMaintenanceItemDto.maintenance_id ||
        updateMaintenanceItemDto.serviceorder_id
      ) {
        // Determinar quais IDs usar para a verificação
        const serviceOrderId =
          updateMaintenanceItemDto.serviceorder_id ??
          itemMaintenance.serviceorder_id;
        const maintenanceId =
          updateMaintenanceItemDto.maintenance_id ??
          itemMaintenance.maintenance_id;

        // Verificar se o novo maintenance já existe na OS (excluindo o próprio item)
        const exists = await this.prisma.itemMaintenance.findFirst({
          where: {
            serviceorder_id: serviceOrderId,
            maintenance_id: maintenanceId,
            id: { not: id }, // Ignora o próprio item na verificação
          },
        });

        if (exists) {
          throw new ConflictException(
            `Serviço de manutenção ID ${maintenanceId} já está adicionado a esta ordem de serviço.`,
          );
        }
      }

      // 3. Atualizar o item
      return this.prisma.itemMaintenance.update({
        where: { id },
        data: {
          value_unity: updateMaintenanceItemDto.value_unity,
          serviceorder_id: updateMaintenanceItemDto.serviceorder_id,
          maintenance_id: updateMaintenanceItemDto.maintenance_id,
          description: updateMaintenanceItemDto.description,
        },
        include: {
          maintenancejob: true,
          serviceorder: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar serviço de manutenção',
      );
    }
  }

  // DELETE - Remove um serviço de manutenção
  async remove(id: number): Promise<void> {
    try {
      const itemMaintenance = await this.prisma.itemMaintenance.findUnique({
        where: { id },
      });

      if (!itemMaintenance)
        throw new NotFoundException('Serviço de manutenção não encontrado');

      await this.prisma.itemMaintenance.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao remover serviço de manutenção',
      );
    }
  }
}
