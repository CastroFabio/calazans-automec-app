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

      const existingMaterial = await this.prisma.material.findUnique({
        where: { id: createMaterialItemDto.material_id },
      });
      const existingServiceOrder = await this.prisma.serviceOrder.findUnique({
        where: { id: createMaterialItemDto.serviceorder_id },
      });

      if (existingMaterial && existingServiceOrder)
        throw new ConflictException(
          'Já existe esse material nessa ordem de serviço',
        );

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

  findAll() {
    return `This action returns all materialItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialItem`;
  }

  update(id: number, updateMaterialItemDto: UpdateMaterialItemDto) {
    return `This action updates a #${id} materialItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialItem`;
  }
}
