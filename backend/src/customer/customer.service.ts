// src/customers/customers.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  HttpException,
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
      if (!createCustomerDto.name || createCustomerDto.name.trim() === '')
        throw new BadRequestException('O nome do cliente é obrigatório');

      if (
        createCustomerDto.cell === null ||
        createCustomerDto.cell === undefined
      ) {
        throw new BadRequestException('O celular é obrigatório');
      }

      if (typeof createCustomerDto.cell !== 'string')
        throw new BadRequestException('O celular deve ser uma string');

      if (
        createCustomerDto.telephone &&
        typeof createCustomerDto.telephone !== 'string'
      )
        throw new BadRequestException('O telefone deve ser uma string');

      if (
        createCustomerDto.observation &&
        typeof createCustomerDto.observation !== 'string'
      )
        throw new BadRequestException('A observação deve ser uma string');

      if (createCustomerDto.cell.trim() === '') {
        throw new BadRequestException('O celular é obrigatório');
      }

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
          name: createCustomerDto.name.trim(),
          cell: createCustomerDto.cell,
          telephone: createCustomerDto.telephone || null,
          observation: createCustomerDto.observation || null,
        },
      });

      return customer;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar cliente');
    }
  }

  // READ - Buscar todos os clientes
  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        _count: { select: { serviceOrders: true, vehicles: true } },
        vehicles: true,
        serviceOrders: {
          include: {
            vehicle: true,
            itemMaintenances: { include: { maintenancejob: true } },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // READ - Buscar um cliente por ID
  async findOne(id: number) {
    try {
      if (id === undefined || id === null)
        throw new BadRequestException('O ID é obrigatório');

      if (isNaN(Number(id)) || typeof id !== 'number')
        throw new BadRequestException('O ID deve ser um número');

      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      if (!customer) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }

      return customer;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(`Erro ao achar o cliente ${id}`);
    }
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
