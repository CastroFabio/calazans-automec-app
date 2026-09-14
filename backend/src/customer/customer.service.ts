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
import { PaginationDto } from './dto/pagination.dto';

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

  async findAllPerPage(paginationDto: PaginationDto) {
    // 1. Tratamento e garantia de conversão dos parâmetros
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 5;
    const search = paginationDto.search?.trim() || '';

    const skip = (page - 1) * limit;

    // 2. Construção dinâmica dos filtros para o Prisma
    const filters: any[] = [];

    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { cell: { contains: search, mode: 'insensitive' } },
          {
            vehicles: {
              some: {
                license_plate: { contains: search, mode: 'insensitive' },
              },
            },
          },
        ],
      });
    }

    // Montagem da cláusula WHERE final
    const whereClause: any = filters.length > 0 ? { AND: filters } : {};

    // 3. Consulta transacionada
    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: 'asc' },
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
      }),
      this.prisma.customer.count({ where: whereClause }),
    ]);

    // 4. Cálculo e estruturação da resposta com metadados
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      meta: {
        currentPage: page,
        perPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // READ - Buscar um cliente por ID
  async findOne(id: number) {
    return this.prisma.customer.findUnique({
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
