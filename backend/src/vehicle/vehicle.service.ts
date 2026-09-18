import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Criar um novo veículo
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      // Verifica se a placa já existe
      const existingVehicle = await this.prisma.vehicle.findUnique({
        where: { license_plate: createVehicleDto.license_plate },
      });

      if (existingVehicle) {
        throw new ConflictException('Já existe um veículo com esta placa');
      }

      // Verifica se o cliente existe (se for fornecido)
      if (createVehicleDto.customer_id) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: createVehicleDto.customer_id },
        });

        if (!customer) {
          throw new NotFoundException('Cliente não encontrado');
        }
      }

      // Cria o veículo
      const vehicle = await this.prisma.vehicle.create({
        data: {
          license_plate: createVehicleDto.license_plate,
          brand: createVehicleDto.brand || null,
          model: createVehicleDto.model || null,
          color: createVehicleDto.color || null,
          year: createVehicleDto.year || null,
          customer_id: createVehicleDto.customer_id || null,
        },
        include: {
          customer: true, // Inclui os dados do cliente na resposta
        },
      });

      return vehicle;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar veículo');
    }
  }

  // READ - Buscar todos os veículos
  async findAll() {
    return this.prisma.vehicle.findMany({
      include: {
        customer: true, // Inclui os dados do cliente
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // READ - Buscar um veículo por ID
  async findOne(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        customer: true, // Inclui os dados do cliente
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }

  // READ - Buscar veículos por cliente
  async findByCustomer(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.vehicle.findMany({
      where: { customer_id: customerId },
      include: {
        customer: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // READ - Buscar veículo por placa
  async findByLicensePlate(licensePlate: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { license_plate: licensePlate },
      include: {
        customer: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }

  // UPDATE - Atualizar um veículo
  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    try {
      // Verifica se o veículo existe
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
      });

      if (!vehicle) {
        throw new NotFoundException('Veículo não encontrado');
      }

      // Verifica se a nova placa já existe (se estiver sendo alterada)
      if (
        updateVehicleDto.license_plate &&
        updateVehicleDto.license_plate !== vehicle.license_plate
      ) {
        const existingVehicle = await this.prisma.vehicle.findUnique({
          where: { license_plate: updateVehicleDto.license_plate },
        });

        if (existingVehicle) {
          throw new ConflictException('Esta placa já está em uso');
        }
      }

      // Verifica se o novo cliente existe (se estiver sendo alterado)
      if (updateVehicleDto.customer_id) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: updateVehicleDto.customer_id },
        });

        if (!customer) {
          throw new NotFoundException('Cliente não encontrado');
        }
      }

      // Atualiza o veículo
      return this.prisma.vehicle.update({
        where: { id },
        data: {
          license_plate: updateVehicleDto.license_plate,
          brand: updateVehicleDto.brand,
          model: updateVehicleDto.model,
          year: updateVehicleDto.year,
          color: updateVehicleDto.color,
          customer_id: updateVehicleDto.customer_id,
        },
        include: {
          customer: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar veículo');
    }
  }

  // DELETE - Remover um veículo
  async remove(id: number): Promise<void> {
    try {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
        include: { serviceOrders: true },
      });

      if (!vehicle) {
        throw new NotFoundException('Veículo não encontrado');
      }

      if (vehicle.serviceOrders.length > 0) {
        throw new BadRequestException(
          'Não é possível excluir um veículo que possui ordens de serviço',
        );
      }

      await this.prisma.vehicle.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover veículo');
    }
  }
}
