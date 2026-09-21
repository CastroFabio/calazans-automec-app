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
import { PaginationDto } from './dto/pagination.dto';
import { CustomerHasPendingDebtsException } from './exceptions';
import { Prisma } from '@prisma/client';

const trimOrUndefined = (value?: string | null) =>
  typeof value === 'string' ? value.trim() : undefined;

// Mantém null apenas para campos opcionais que ACEITAM null no banco (ex: telephone, observation)
const trimOrNull = (value?: string | null) =>
  typeof value === 'string' ? value.trim() : value;

const sanitizePhone = (value?: string | null) =>
  typeof value === 'string' ? value.replace(/\D/g, '') : value;

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
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar cliente');
    }
  }

  async findAllPerPage(paginationDto: PaginationDto) {
    // 1. Tratamento e garantia de conversão dos parâmetros
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 5;
    const search = paginationDto.search?.trim() || '';

    const skip = (page - 1) * limit;

    // 2. Construção dinâmica dos filtros para o Prisma
    const filters: Prisma.CustomerWhereInput[] = [];

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
    const whereClause: Prisma.CustomerWhereInput =
      filters.length > 0 ? { AND: filters } : {};

    // 3. Consulta transacionada
    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
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
  // Helper functions fora do método
  trimOrUndefined = (value?: string | null) =>
    typeof value === 'string' ? value.trim() : undefined;

  trimOrNull = (value?: string | null) =>
    typeof value === 'string' ? value.trim() : value;

  sanitizePhone = (value?: string | null) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value;

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      if (id === undefined || id === null)
        throw new BadRequestException('O ID é obrigatório');

      if (isNaN(Number(id)) || typeof id !== 'number')
        throw new BadRequestException('O ID deve ser um número');

      if (!updateCustomerDto || Object.keys(updateCustomerDto).length === 0) {
        throw new BadRequestException('Nenhum corpo na requisição');
      }

      // 1. Verifica se o cliente existe
      const customer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new NotFoundException('Cliente não encontrado');
      }

      // 2. Validações de Tipo
      if (
        updateCustomerDto.name &&
        typeof updateCustomerDto.name !== 'string'
      ) {
        throw new BadRequestException('O nome do cliente deve ser string');
      }

      if (
        updateCustomerDto.cell &&
        typeof updateCustomerDto.cell !== 'string'
      ) {
        throw new BadRequestException('O celular do cliente deve ser string');
      }

      if (
        updateCustomerDto.telephone &&
        typeof updateCustomerDto.telephone !== 'string'
      ) {
        throw new BadRequestException('O telefone do cliente deve ser string');
      }

      if (
        updateCustomerDto.observation &&
        typeof updateCustomerDto.observation !== 'string'
      ) {
        throw new BadRequestException(
          'A observação do cliente deve ser string',
        );
      }

      // 3. Sanitização do Celular para verificação de duplicidade
      const sanitizedCellInput = sanitizePhone(updateCustomerDto.cell);

      // 4. Verifica unicidade do Celular
      if (sanitizedCellInput && sanitizedCellInput !== customer.cell) {
        const existingCustomer = await this.prisma.customer.findUnique({
          where: { cell: sanitizedCellInput },
        });

        if (existingCustomer) {
          throw new ConflictException('Este celular já está em uso');
        }
      }

      // 5. Atualização
      return await this.prisma.customer.update({
        where: { id },
        data: {
          ...(updateCustomerDto.name !== undefined && {
            name: trimOrUndefined(updateCustomerDto.name),
          }),
          ...(updateCustomerDto.cell !== undefined && {
            cell: trimOrUndefined(sanitizedCellInput),
          }),
          ...(updateCustomerDto.telephone !== undefined && {
            telephone: trimOrNull(sanitizePhone(updateCustomerDto.telephone)),
          }),
          ...(updateCustomerDto.observation !== undefined && {
            observation: trimOrNull(updateCustomerDto.observation),
          }),
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar cliente');
    }
  }

  // DELETE - Remover um cliente
  async remove(id: number): Promise<void> {
    try {
      if (id === undefined || id === null)
        throw new BadRequestException('O ID é obrigatório');

      if (isNaN(Number(id)) || typeof id !== 'number')
        throw new BadRequestException('O ID deve ser um número');

      if (Number(id) <= 0)
        throw new BadRequestException('O ID deve maior do que zero');

      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          vehicles: true,
          serviceOrders: true,
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

      const listDebitoPendete = (customer.serviceOrders || []).filter(
        (order) => Number(order.paid) < Number(order.subtotal),
      );

      if (listDebitoPendete.length > 0)
        throw new CustomerHasPendingDebtsException();

      if (customer.serviceOrders.length > 0) {
        throw new BadRequestException(
          'Não é possível excluir um cliente que possui ordem de serviço',
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
