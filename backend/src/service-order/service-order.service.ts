import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

const STATUS = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  OPEN: 4,
  WAITING_PARTS: 5,
  CANCELED: 6,
} as const;

const PAYMENT_STATUS = {
  AWAITING_PAYMENT: 1,
  PARTIALLY_PAID: 2,
  FULLY_PAID: 3,
  NOT_REQUIRED_TO_PAY: 4,
} as const;

@Injectable()
export class ServiceOrderService {
  constructor(private prisma: PrismaService) {}

  async countAll() {
    return await this.prisma.serviceOrder.count();
  }

  async getMetricsDashboard() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const endOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [currentMonthAggregate, previousMonthAggregate] = await Promise.all([
      // Faturamento Mês Atual
      this.prisma.serviceOrder.aggregate({
        _sum: { subtotal: true },
        where: {
          status: STATUS.COMPLETED,
          paymentStatus: PAYMENT_STATUS.AWAITING_PAYMENT,
          arrived_at: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        },
      }),

      // Faturamento Mês Anterior
      this.prisma.serviceOrder.aggregate({
        _sum: { subtotal: true },
        where: {
          status: STATUS.COMPLETED,
          paymentStatus: PAYMENT_STATUS.AWAITING_PAYMENT,
          arrived_at: { gte: startOfPreviousMonth, lte: endOfPreviousMonth },
        },
      }),
    ]);

    // 1. Métricas Financeiras e de Volume do Mês Atual
    const [monthlyRevenueResult, completedOrdersCount] = await Promise.all([
      this.prisma.serviceOrder.aggregate({
        _sum: { subtotal: true },
        where: {
          paymentStatus: PAYMENT_STATUS.FULLY_PAID,
          arrived_at: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        },
      }),

      // Total de OSs concluídas e totalmente pagas no mês
      this.prisma.serviceOrder.count({
        where: {
          status: STATUS.COMPLETED,
          paymentStatus: PAYMENT_STATUS.FULLY_PAID,
          arrived_at: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        },
      }),
    ]);

    // 2. Status e Valores Pendentes / A Receber
    const [
      openOrdersCount,
      inProgressOrdersCount,
      awaitingPaymentOrdersCount,
      pendingAmountAggregate,
    ] = await Promise.all([
      // Total em aberto na oficina (Pendente, Em andamento, Aberta, Aguardando peças)
      this.prisma.serviceOrder.count({
        where: {
          status: {
            in: [
              STATUS.PENDING,
              STATUS.IN_PROGRESS,
              STATUS.OPEN,
              STATUS.WAITING_PARTS,
            ],
          },
        },
      }),

      // Quantidade em andamento
      this.prisma.serviceOrder.count({
        where: {
          status: STATUS.IN_PROGRESS,
        },
      }),

      // Subtexto do 'A Receber': Quantas OS concluídas estão aguardando pagamento
      this.prisma.serviceOrder.count({
        where: {
          status: STATUS.COMPLETED,
          paymentStatus: PAYMENT_STATUS.AWAITING_PAYMENT,
        },
      }),

      // Cálculo do saldo devedor de OSs entregues/concluídas (subtotal - paid)
      this.prisma.serviceOrder.aggregate({
        _sum: {
          subtotal: true,
          paid: true,
        },
        where: {
          status: STATUS.COMPLETED,
          paymentStatus: PAYMENT_STATUS.AWAITING_PAYMENT,
        },
      }),
    ]);

    // 3. Agrupamentos e Rankings
    const [statusGroup, topMaintenancesGroup] = await Promise.all([
      this.prisma.serviceOrder.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      this.prisma.itemMaintenance.groupBy({
        by: ['maintenance_id'],
        _count: { maintenance_id: true },
        where: {
          maintenance_id: { not: null },
        },
        orderBy: {
          _count: { maintenance_id: 'desc' },
        },
        take: 6,
      }),
    ]);

    // 4. Histórico dos Últimos 6 Meses e Totais Gerais
    const [sixMonthsOrders, totalOrdersCount] = await Promise.all([
      // Traz as OSs entregues/concluídas nos últimos 6 meses para agrupamento no gráfico
      this.prisma.serviceOrder.findMany({
        where: {
          status: STATUS.COMPLETED, // Mesma regra do faturamento mensal
          paymentStatus: PAYMENT_STATUS.AWAITING_PAYMENT,
          arrived_at: { not: null, gte: sixMonthsAgo, lte: endOfCurrentMonth },
        },
        select: {
          subtotal: true,
          arrived_at: true,
        },
      }),

      // Total geral de OSs registradas na base
      this.prisma.serviceOrder.count(),
    ]);

    // Ticket Médio / OS (Histórico Global)
    const averageTicketResult = await this.prisma.serviceOrder.aggregate({
      _avg: { subtotal: true },
      _count: { id: true },
      where: {
        // OSs concluídas na manutenção
        status: STATUS.COMPLETED,
      },
    });
    // --- Processamento dos Resultados ---
    const currentRevenue = Number(currentMonthAggregate._sum.subtotal || 0);
    const previousRevenue = Number(previousMonthAggregate._sum.subtotal || 0);
    const monthlyRevenue = Number(monthlyRevenueResult._sum.subtotal ?? 0);
    const sixMonthRevenue = sixMonthsOrders.reduce(
      (acc, order) => acc + Number(order.subtotal || 0),
      0,
    );
    const averageTicket = averageTicketResult._avg.subtotal
      ? Number(averageTicketResult._avg.subtotal)
      : 0;
    const totalCompletedOrders = averageTicketResult._count.id;
    const totalPendingAmount =
      Number(pendingAmountAggregate._sum.subtotal || 0) -
      Number(pendingAmountAggregate._sum.paid || 0);
    const statusLabels: Record<number, string> = {
      1: 'Pendente',
      2: 'Em andamento',
      3: 'Concluído',
      4: 'Aberta',
      5: 'Aguardando peças',
      6: 'Cancelada',
      7: 'Ainda a pagar',
    };
    const totalTop6JobsCount = topMaintenancesGroup.reduce(
      (acc, item) => acc + item._count.maintenance_id,
      0,
    );

    const statusBreakdown = statusGroup.map((item) => ({
      statusId: item.status,
      statusName: item.status
        ? (statusLabels[item.status] ?? 'Desconhecido')
        : 'Sem Status',
      count: item._count.id,
    }));

    // Busca os nomes das manutenções do Top 6 para enviar ao front-end
    const maintenanceIds = topMaintenancesGroup
      .map((item) => item.maintenance_id)
      .filter((id): id is number => id !== null);

    const maintenances = await this.prisma.maintenanceJob.findMany({
      where: { id: { in: maintenanceIds } },
      select: { id: true, name: true },
    });

    const topServices = topMaintenancesGroup.map((item) => {
      const job = maintenances.find((m) => m.id === item.maintenance_id);
      return {
        serviceId: item.maintenance_id ?? 0, // Mapeia para serviceId e garante type 'number'
        name: job?.name || 'Serviço não identificado',
        count: item._count.maintenance_id,
      };
    });

    // Agrupa o faturamento dos últimos 6 meses por Mês/Ano
    const revenueByMonthMap = new Map<string, number>();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      revenueByMonthMap.set(monthKey, 0);
    }

    for (const order of sixMonthsOrders) {
      const date = order.arrived_at;
      if (!date) continue;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (revenueByMonthMap.has(monthKey)) {
        const currentSum = revenueByMonthMap.get(monthKey) ?? 0;
        revenueByMonthMap.set(
          monthKey,
          currentSum + Number(order.subtotal ?? 0),
        );
      }
    }

    const revenueLast6Months = Array.from(revenueByMonthMap.entries()).map(
      ([month, total]) => ({
        month,
        total,
      }),
    );

    return {
      monthlyRevenue,
      currentRevenue,
      previousRevenue,
      averageTicket,
      totalCompletedOrders,
      openServiceOrdersCount: openOrdersCount,
      completedServiceOrdersCount: completedOrdersCount,
      awaitingPaymentServiceOrdersCount: awaitingPaymentOrdersCount,
      inProgressServiceOrdersCount: inProgressOrdersCount,
      totalPendingAmount,
      statusBreakdown,
      topServices,
      totalTop6JobsCount,
      revenueLast6Months,
      sixMonthRevenue,
      totalOrdersCount,
    };
  }

  async findAllPerPage(paginationDto: PaginationDto) {
    // 1. Tratamento e garantia de conversão dos parâmetros
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 5;
    const search = paginationDto.search?.trim() || '';
    const status = paginationDto.status;

    const skip = (page - 1) * limit;

    // 2. Construção dinâmica dos filtros usando a interface forte do Prisma
    const filters: Prisma.ServiceOrderWhereInput[] = [];

    // Filtro textual: Busca por nome do cliente ou placa do veículo
    if (search) {
      filters.push({
        OR: [
          {
            customer: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
          {
            vehicle: {
              license_plate: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    // Filtro numérico: Status da Ordem de Serviço
    if (status !== undefined && status !== null && !isNaN(Number(status))) {
      filters.push({ status: Number(status) });
    }

    // Montagem da cláusula WHERE final tipada corretamente
    const whereClause: Prisma.ServiceOrderWhereInput =
      filters.length > 0 ? { AND: filters } : {};

    // 3. Consulta transacionada
    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.serviceOrder.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          customer: true,
          vehicle: true,
          itemMaintenances: {
            include: { maintenancejob: { select: { id: true, name: true } } },
          },
          itemMaterials: {
            include: { material: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.serviceOrder.count({ where: whereClause }),
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

  // CREATE - Criar uma ordem de serviço
  async create(createServiceOrderDto: CreateServiceOrderDto) {
    try {
      if (createServiceOrderDto.customer_id) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: createServiceOrderDto.customer_id },
        });
        if (!customer) throw new ConflictException('Cliente não encontrado');
      }

      if (createServiceOrderDto.vehicle_id) {
        const vehicleExists = await this.prisma.vehicle.findUnique({
          where: { id: createServiceOrderDto.vehicle_id },
        });

        if (!vehicleExists)
          throw new ConflictException(
            'Veículo não encontrado ou não pertence ao cliente',
          );

        const vehicleOwned = await this.prisma.vehicle.findFirst({
          where: {
            id: createServiceOrderDto.vehicle_id,
            customer_id: createServiceOrderDto.customer_id,
          },
        });
        if (!vehicleOwned)
          throw new ConflictException('Veículo não pertence ao cliente');
      }

      const existingCustomer = await this.prisma.customer.findUnique({
        where: { id: createServiceOrderDto.customer_id },
      });

      const existingVehicle = await this.prisma.vehicle.findUnique({
        where: { id: createServiceOrderDto.vehicle_id },
      });

      if (!existingCustomer && !existingVehicle)
        throw new ConflictException(
          'Já existe um veículo para esse cliente atribuído a ordem de serviço',
        );

      const serviceOrder = await this.prisma.serviceOrder.create({
        data: {
          professional: createServiceOrderDto.professional,
          paymentStatus: createServiceOrderDto.paymentStatus,
          status: createServiceOrderDto.status,
          arrived_at: createServiceOrderDto.arrived_at,
          customer_id: createServiceOrderDto.customer_id,
          vehicle_id: createServiceOrderDto.vehicle_id,
          entry_km: createServiceOrderDto.entry_km,
          diagnosis: createServiceOrderDto.diagnosis,
          observation: createServiceOrderDto.observation,
          subtotal: createServiceOrderDto.subtotal,
          labor_cost: createServiceOrderDto.labor_cost,
          paid: createServiceOrderDto.paid,
        },
        include: {
          customer: true,
          vehicle: true,
          itemMaintenances: { include: { maintenancejob: true } },
          itemMaterials: { include: { material: true } },
        },
      });

      return serviceOrder;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar ordem de serviço', {
        cause: error,
      });
    }
  }

  // READ - Buscar todas as ordens de serviço
  async findAll() {
    try {
      return this.prisma.serviceOrder.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          customer: { select: { id: true, name: true } },
          vehicle: true,
          itemMaintenances: {
            include: { maintenancejob: { select: { id: true, name: true } } },
          },
          itemMaterials: {
            include: { material: { select: { id: true, name: true } } },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao buscar todos as ordens de serviço',
        { cause: error },
      );
    }
  }

  // READ - Buscar ordem de serviço por ID
  async findOne(id: number) {
    try {
      const serviceOrder = await this.prisma.serviceOrder.findUnique({
        where: { id },
        include: {
          customer: { select: { id: true, name: true, cell: true } },
          vehicle: {
            select: {
              id: true,
              license_plate: true,
              model: true,
              brand: true,
            },
          },
          itemMaintenances: {
            include: { maintenancejob: { select: { id: true, name: true } } },
          },
          itemMaterials: {
            include: { material: { select: { id: true, name: true } } },
          },
        },
      });

      if (!serviceOrder)
        throw new NotFoundException('Ordem de serviço não encontrada');

      return serviceOrder;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Erro ao buscar a ordem de serviço ${id}`,
        { cause: error },
      );
    }
  }

  // UPDATE - Atualizar uma ordem de serviço
  async update(id: number, updateServiceOrderDto: UpdateServiceOrderDto) {
    try {
      const serviceOrder = await this.prisma.serviceOrder.findUnique({
        where: { id },
      });

      if (!serviceOrder)
        throw new NotFoundException('Ordem de serviço não encontrada');

      if (updateServiceOrderDto.customer_id) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: updateServiceOrderDto.customer_id },
        });

        if (!customer) throw new NotFoundException('Cliente não encontrado');
      }

      if (updateServiceOrderDto.vehicle_id) {
        const vehicle = await this.prisma.vehicle.findUnique({
          where: { id: updateServiceOrderDto.vehicle_id },
        });

        if (!vehicle) throw new NotFoundException('Veículo não encontrado');

        const vehicleOwned = await this.prisma.vehicle.findFirst({
          where: {
            id: updateServiceOrderDto.vehicle_id,
            customer_id: updateServiceOrderDto.customer_id,
          },
        });
        if (!vehicleOwned)
          throw new ConflictException('Veículo não pertence ao cliente');
      }

      return this.prisma.serviceOrder.update({
        where: { id },
        data: {
          professional: updateServiceOrderDto.professional,
          paymentStatus: updateServiceOrderDto.paymentStatus,
          status: updateServiceOrderDto.status,
          arrived_at: updateServiceOrderDto.arrived_at,
          customer_id: updateServiceOrderDto.customer_id,
          vehicle_id: updateServiceOrderDto.vehicle_id,
          entry_km: updateServiceOrderDto.entry_km,
          diagnosis: updateServiceOrderDto.diagnosis,
          observation: updateServiceOrderDto.observation,
          subtotal: updateServiceOrderDto.subtotal,
          labor_cost: updateServiceOrderDto.labor_cost,
          paid: updateServiceOrderDto.paid,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar a ordem de serviço',
        { cause: error },
      );
    }
  }

  // DELETE - Remover uma ordem de serviço
  async remove(id: number): Promise<void> {
    try {
      const serviceOrder = await this.prisma.serviceOrder.findUnique({
        where: { id },
      });

      if (!serviceOrder)
        throw new NotFoundException('Ordem de serviço não encontrada');

      await this.prisma.serviceOrder.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro ao remover a ordem de serviço',
        { cause: error },
      );
    }
  }
}
