import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        cell: createCustomerDto.cell,
      },
    });

    if (customer) {
      throw new HttpException(
        'Customer already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCustomer = await this.prisma.customer.create({
      data: { ...createCustomerDto },
    });

    return newCustomer;
  }

  async findAll() {
    const customers = await this.prisma.customer.findMany();
    return customers;
  }

  async findOne(@Param('id') id: number) {
    if (!id) {
      throw new Error('Customer ID is required');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    if (updateCustomerDto.cell) {
      const cellExists = await this.prisma.customer.findFirst({
        where: { cell: updateCustomerDto.cell, NOT: { id } },
      });
      if (cellExists) {
        throw new HttpException(
          'Cell phone already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updateCustomer = await this.prisma.customer.update({
      where: { id },
      data: { ...updateCustomerDto },
    });
    return updateCustomer;
  }

  async remove(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    const deleteCustomer = await this.prisma.customer.delete({
      where: { id },
    });

    return deleteCustomer;
  }
}
