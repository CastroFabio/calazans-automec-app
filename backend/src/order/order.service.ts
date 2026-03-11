import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customer_id },
    });

    if (!customer) {
      console.log(customer);
      throw new NotFoundException(
        `Customer with ID ${createOrderDto.customer_id} not found`,
      );
    }

    const car = await this.prisma.car.findUnique({
      where: { id: createOrderDto.car_id },
    });

    if (!car) {
      throw new NotFoundException(
        `Car with ID ${createOrderDto.car_id} not found`,
      );
    }

    const {
      customer_id,
      car_id,
      itensMaintenance,
      itensMaterial,
      ...orderData
    } = createOrderDto;

    const newOrder = await this.prisma.order.create({
      data: {
        ...orderData,
        customer: {
          connect: { id: createOrderDto.customer_id },
        },
        car: {
          connect: { id: createOrderDto.car_id },
        },
        total_value: this.calcularTotal(createOrderDto),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (createOrderDto.itensMaintenance?.length) {
      await this.prisma.item_Maintenance.createMany({
        data: createOrderDto.itensMaintenance.map((item) => ({
          maintenance_id: item.maintenance_id,
          value_unit: item.value_unit,
          quantidade: item.quantidade,
          subtotal: item.quantidade * item.value_unit,
          order_id: newOrder.id,
        })),
      });
    }

    if (createOrderDto.itensMaterial?.length) {
      await this.prisma.item_Material.createMany({
        data: createOrderDto.itensMaterial.map((item) => ({
          material_id: item.material_id,
          value_unit: item.value_unit,
          quantidade: item.quantidade,
          subtotal: item.quantidade * item.value_unit,
          order_id: newOrder.id,
        })),
      });
    }

    return this.prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        itemMaintenance: true,
        itemMaterials: true,
      },
    });
  }

  private calcularTotal(dto: CreateOrderDto): number {
    const totalMateriais =
      dto.itensMaterial?.reduce(
        (sum, item) => sum + item.quantidade * item.value_unit,
        0,
      ) || 0;

    const totalServicos =
      dto.itensMaintenance?.reduce(
        (sum, item) => sum + item.quantidade * item.value_unit,
        0,
      ) || 0;

    return totalMateriais + totalServicos;
  }

  async findAll() {
    const order = await this.prisma.order.findMany();

    return order;
  }

  async findOne(@Param('id') id: number) {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const order = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
        updated_at: new Date(),
      },
    });
    if (updateOrderDto.itensMaterial) {
      await this.prisma.item_Material.deleteMany({ where: { order_id: id } });
      if (updateOrderDto.itensMaterial.length > 0) {
        await this.prisma.item_Material.createMany({
          data: updateOrderDto.itensMaterial.map((item) => ({
            ...item,
            subtotal: item.subtotal || 0,
            order_id: id,
          })),
        });
      }
    }

    if (updateOrderDto.itensMaintenance) {
      await this.prisma.item_Maintenance.deleteMany({
        where: { order_id: id },
      });
      if (updateOrderDto.itensMaintenance.length > 0) {
        await this.prisma.item_Maintenance.createMany({
          data: updateOrderDto.itensMaintenance.map((item) => ({
            ...item,
            subtotal: item.subtotal || 0,
            order_id: id,
          })),
        });
      }
    }
    return updatedOrder;
  }

  async remove(id: number) {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const deletedOrder = await this.prisma.order.delete({
      where: { id },
    });

    return deletedOrder;
  }
}
