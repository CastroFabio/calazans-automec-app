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
          priority: createServiceOrderDto.priority,
          status: createServiceOrderDto.status,
          arrived_at: createServiceOrderDto.arrived_at,
          customer_id: createServiceOrderDto.customer_id,
          vehicle_id: createServiceOrderDto.vehicle_id,
          entry_km: createServiceOrderDto.entry_km,
          diagnosis: createServiceOrderDto.diagnosis,
          observation: createServiceOrderDto.observation,
          subtotal: createServiceOrderDto.subtotal,
        },
        include: { customer: true, vehicle: true },
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
    return this.prisma.serviceOrder.findMany({ orderBy: { id: 'asc' } });
  }

  /*
  findOne(id: number) {
    return `This action returns a #${id} serviceOrder`;
  }

  update(id: number, updateServiceOrderDto: UpdateServiceOrderDto) {
    return `This action updates a #${id} serviceOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceOrder`;
  } */
}
