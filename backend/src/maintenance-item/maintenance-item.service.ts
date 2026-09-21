import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaintenanceItemDto } from './dto/create-maintenance-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMaintenanceItemDto } from './dto/update-maintenance-item.dto';
import { CreateItemMaintenanceBatchDto } from './dto/create-item-maintenance-batch.dto';

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
          serviceorder_id: createMaintenanceItemDto.serviceorder_id,
          maintenance_id: createMaintenanceItemDto.maintenance_id,
          description: createMaintenanceItemDto.description,
        },
        include: { maintenancejob: true },
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

  // CREATE BATCH - Criar múltiplos itens de uma vez
  async createBatch(createBatchDto: CreateItemMaintenanceBatchDto) {
    try {
      const { items } = createBatchDto;

      if (!items || items.length === 0) {
        throw new BadRequestException('Nenhum item para criar');
      }

      // Validar: cada item deve ter maintenance_id OU description
      for (const item of items) {
        if (!item.maintenance_id && !item.description) {
          throw new BadRequestException(
            'Cada item deve ter maintenance_id ou description',
          );
        }
      }

      // Validar se as manutenções existem (apenas as que têm ID)
      const maintenanceIds = items
        .filter((item) => item.maintenance_id)
        .map((item) => item.maintenance_id as number);

      if (maintenanceIds.length > 0) {
        const existingMaintenances = await this.prisma.maintenanceJob.findMany({
          where: { id: { in: maintenanceIds } },
          select: { id: true },
        });

        const existingIds = new Set(existingMaintenances.map((m) => m.id));
        const missingIds = maintenanceIds.filter((id) => !existingIds.has(id));

        if (missingIds.length > 0) {
          throw new NotFoundException(
            `Manutenções não encontradas: ${missingIds.join(', ')}`,
          );
        }
      }

      // Validar se a OS existe
      const orderIds = [...new Set(items.map((item) => item.serviceorder_id))];
      const existingOrders = await this.prisma.serviceOrder.findMany({
        where: { id: { in: orderIds } },
        select: { id: true },
      });

      const existingOrderIds = new Set(existingOrders.map((o) => o.id));
      const missingOrderIds = orderIds.filter(
        (id) => !existingOrderIds.has(id),
      );

      if (missingOrderIds.length > 0) {
        throw new NotFoundException(
          `Ordens de serviço não encontradas: ${missingOrderIds.join(', ')}`,
        );
      }

      const data = items.map((item) => ({
        serviceorder_id: item.serviceorder_id,
        maintenance_id: item.maintenance_id
          ? Number(item.maintenance_id)
          : undefined,
        description: item.description ?? undefined,
      }));

      // Criar todos de uma vez com createMany
      const result = await this.prisma.itemMaintenance.createMany({
        data,
        skipDuplicates: false,
      });

      // Buscar os itens criados para retornar
      const createdItems = await this.prisma.itemMaintenance.findMany({
        where: {
          serviceorder_id: { in: orderIds },
        },
        include: {
          maintenancejob: {
            include: {
              group: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: items.length,
      });

      return {
        count: result.count,
        items: createdItems,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      throw new InternalServerErrorException(
        'Erro ao criar itens de manutenção: ' + errorMessage,
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
