import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaterialItemDto } from './dto/create-material-item.dto';
import { UpdateMaterialItemDto } from './dto/update-material-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemMaterialBatchDto } from './dto/create-item-material-batch.dto';

@Injectable()
export class MaterialItemService {
  constructor(private prisma: PrismaService) {}

  async existsMaterialInOrder(
    serviceOrderId: number,
    materialId: number,
  ): Promise<boolean> {
    const count = await this.prisma.itemMaterial.count({
      where: {
        serviceorder_id: serviceOrderId,
        material_id: materialId,
      },
    });
    return count > 0;
  }

  // CREATE - Criar um item de material
  async create(createMaterialItemDto: CreateMaterialItemDto) {
    try {
      if (createMaterialItemDto.material_id) {
        const material = await this.prisma.material.findUnique({
          where: { id: createMaterialItemDto.material_id },
        });
        if (!material) throw new ConflictException('Material não encontrado');
      }

      if (createMaterialItemDto.serviceorder_id) {
        const serviceOrder = await this.prisma.serviceOrder.findUnique({
          where: { id: createMaterialItemDto.serviceorder_id },
        });
        if (!serviceOrder)
          throw new ConflictException('Ordem de serviço não encontrado');
      }

      const exists = await this.existsMaterialInOrder(
        createMaterialItemDto.serviceorder_id,
        createMaterialItemDto.material_id,
      );
      if (exists) {
        throw new ConflictException(
          `Material já está adicionado a esta ordem de serviço.`,
        );
      }

      const materialItem = await this.prisma.itemMaterial.create({
        data: {
          quantity: createMaterialItemDto.quantity,
          value_unit: createMaterialItemDto.value_unit,
          serviceorder_id: createMaterialItemDto.serviceorder_id,
          material_id: createMaterialItemDto.material_id,
          supplier: createMaterialItemDto.supplier,
          receipt: createMaterialItemDto.receipt,
          itemMaintenance_id: createMaterialItemDto.itemMaintenance_id,
        },
      });

      return materialItem;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar item de material');
    }
  }

  // CREATE BATCH - Criar múltiplos itens de uma vez
  async createBatch(createBatchDto: CreateItemMaterialBatchDto) {
    try {
      const { items } = createBatchDto;

      if (!items || items.length === 0) {
        throw new Error('Nenhum item para criar');
      }

      // Validar se todos os materiais existem
      const materialIds = items.map((item) => item.material_id);
      const existingMaterials = await this.prisma.material.findMany({
        where: { id: { in: materialIds } },
        select: { id: true },
      });

      const existingIds = new Set(existingMaterials.map((m) => m.id));
      const missingIds = materialIds.filter((id) => !existingIds.has(id));

      if (missingIds.length > 0) {
        throw new NotFoundException(
          `Materiais não encontrados: ${missingIds.join(', ')}`,
        );
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

      // Preparar dados para createMany
      const data = items.map((item) => ({
        material_id: item.material_id,
        quantity: item.quantity,
        value_unit: item.value_unit,
        supplier: item.supplier || null,
        receipt: item.receipt || null,
        serviceorder_id: item.serviceorder_id,
        itemMaintenance_id: item.itemMaintenance_id,
      }));

      // Criar todos de uma vez com createMany
      const result = await this.prisma.itemMaterial.createMany({
        data,
        skipDuplicates: false,
      });

      // Buscar os itens criados para retornar
      const createdItems = await this.prisma.itemMaterial.findMany({
        where: {
          material_id: { in: materialIds },
          serviceorder_id: { in: orderIds },
        },
        include: {
          material: {
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
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar itens de material: ',
      );
    }
  }

  // READ - Buscar todos os itens de material
  async findAll() {
    return this.prisma.itemMaterial.findMany();
  }

  // READ - Buscar um item de material por ID
  async findOne(id: number) {
    const materialItem = await this.prisma.itemMaterial.findUnique({
      where: { id },
      include: { material: true },
    });

    if (!materialItem)
      throw new NotFoundException('Item de material não encontrado');

    return materialItem;
  }

  // UPDATE - Atualizar um item de material
  async update(id: number, updateMaterialItemDto: UpdateMaterialItemDto) {
    try {
      // 1. Buscar o item atual
      const itemMaterial = await this.prisma.itemMaterial.findUnique({
        where: { id },
      });

      if (!itemMaterial) {
        throw new NotFoundException('Item de material não encontrado');
      }

      // 2. Verificar se está tentando alterar o material ou a OS
      // Se NÃO está alterando material_id OU serviceorder_id, pula a verificação
      if (
        updateMaterialItemDto.material_id ||
        updateMaterialItemDto.serviceorder_id
      ) {
        // Determinar quais IDs usar para a verificação
        const serviceOrderId =
          updateMaterialItemDto.serviceorder_id ?? itemMaterial.serviceorder_id;
        const materialId =
          updateMaterialItemDto.material_id ?? itemMaterial.material_id;

        // Verificar se o novo material já existe na OS (excluindo o próprio item)
        const exists = await this.prisma.itemMaterial.findFirst({
          where: {
            serviceorder_id: serviceOrderId,
            material_id: materialId,
            id: { not: id }, // Ignora o próprio item na verificação
          },
        });

        if (exists) {
          throw new ConflictException(
            `Material ID ${materialId} já está adicionado a esta ordem de serviço.`,
          );
        }
      }

      // 3. Atualizar o item
      return this.prisma.itemMaterial.update({
        where: { id },
        data: {
          quantity: updateMaterialItemDto.quantity,
          value_unit: updateMaterialItemDto.value_unit,
          serviceorder_id: updateMaterialItemDto.serviceorder_id,
          material_id: updateMaterialItemDto.material_id,
          receipt: updateMaterialItemDto.receipt,
          supplier: updateMaterialItemDto.supplier,
        },
        include: {
          material: true,
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
        'Erro ao atualizar item de material',
      );
    }
  }

  // DELETE - Remove um item de material
  async remove(id: number): Promise<void> {
    try {
      const itemMaterial = await this.prisma.itemMaterial.findUnique({
        where: { id },
      });

      if (!itemMaterial)
        throw new NotFoundException('Item de material não encontrado');

      await this.prisma.itemMaterial.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao remover item de material',
      );
    }
  }
}
