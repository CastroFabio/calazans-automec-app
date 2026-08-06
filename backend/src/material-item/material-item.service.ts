import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaterialItemDto } from './dto/create-material-item.dto';
import { UpdateMaterialItemDto } from './dto/update-material-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
          value_unity: createMaterialItemDto.value_unity,
          serviceorder_id: createMaterialItemDto.serviceorder_id,
          material_id: createMaterialItemDto.material_id,
          reference: createMaterialItemDto.reference,
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
          value_unity: updateMaterialItemDto.value_unity,
          serviceorder_id: updateMaterialItemDto.serviceorder_id,
          material_id: updateMaterialItemDto.material_id,
          reference: updateMaterialItemDto.reference,
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
