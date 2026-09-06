import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceOrderService {
  constructor(private prisma: PrismaService) {}

  async countAll() {
    return await this.prisma.serviceOrder.count();
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
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar ordem de serviço');
    }
  }

  // READ - Buscar todas as ordens de serviço
  async findAll() {
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
  }

  // READ - Buscar ordem de serviço por ID
  async findOne(id: number) {
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
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar ordem de serviço',
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao remover ordem de serviço',
      );
    }
  }
}
