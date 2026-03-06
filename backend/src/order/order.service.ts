import {
  BadRequestException,
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

    if (createOrderDto.total_value < 0) {
      throw new BadRequestException(
        'Total value must be greater than or equal to 0',
      );
    }

    const totalValue = parseFloat(createOrderDto.total_value.toString());

    const newOrder = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        total_value: totalValue,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return newOrder;
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
      data: { ...updateOrderDto },
    });

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
