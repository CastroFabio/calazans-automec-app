// src/customers/customers.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async countAll() {
    return await this.prisma.customer.count();
  }

  // CREATE - Criar um novo cliente
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      // Verifica se o celular já existe
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { cell: createCustomerDto.cell },
      });

      if (existingCustomer) {
        throw new ConflictException('Já existe um cliente com este celular');
      }

      // Cria o cliente
      const customer = await this.prisma.customer.create({
        data: {
          name: createCustomerDto.name,
          cell: createCustomerDto.cell,
          telephone: createCustomerDto.telephone || null,
          observation: createCustomerDto.observation || null,
        },
      });

      return customer;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar cliente');
    }
  }

  // READ - Buscar todos os clientes
  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        vehicles: true, // Inclui os veículos do cliente
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // READ - Buscar um cliente por ID
  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: true, // Inclui os veículos do cliente
      },
    });
  }

  // READ - Buscar cliente por celular
  async findByCell(cell: string) {
    return this.prisma.customer.findUnique({
      where: { cell },
      include: {
        vehicles: true,
      },
    });
  }

  // UPDATE - Atualizar um cliente
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      // Verifica se o cliente existe
      const customer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new Error('Cliente não encontrado');
      }

      // Verifica se o novo celular já existe (se estiver sendo alterado)
      if (updateCustomerDto.cell && updateCustomerDto.cell !== customer.cell) {
        const existingCustomer = await this.prisma.customer.findUnique({
          where: { cell: updateCustomerDto.cell },
        });

        if (existingCustomer) {
          throw new ConflictException('Este celular já está em uso');
        }
      }

      // Atualiza o cliente
      return this.prisma.customer.update({
        where: { id },
        data: {
          name: updateCustomerDto.name,
          cell: updateCustomerDto.cell,
          telephone: updateCustomerDto.telephone,
          observation: updateCustomerDto.observation,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar cliente');
    }
  }

  // DELETE - Remover um cliente
  async remove(id: number): Promise<void> {
    // ← Mude para Promise<void>
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          vehicles: true,
        },
      });

      if (!customer) {
        throw new NotFoundException('Cliente não encontrado');
      }

      if (customer.vehicles.length > 0) {
        throw new BadRequestException(
          'Não é possível excluir um cliente que possui veículos',
        );
      }

      await this.prisma.customer.delete({
        where: { id },
      });

      // Não retorna nada (void)
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover cliente');
    }
  }
}
