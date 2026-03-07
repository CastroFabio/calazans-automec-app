import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: {
        name: createMaintenanceDto.name,
      },
    });

    if (maintenance) {
      throw new HttpException(
        'Maintenance already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newMaintenance = await this.prisma.maintenance.create({
      data: { ...createMaintenanceDto },
    });

    return newMaintenance;
  }

  async findAll() {
    const maintenance = await this.prisma.maintenance.findMany();
    return maintenance;
  }

  async findOne(@Param('id') id: number) {
    if (!id) {
      throw new Error('Maintenance ID is required');
    }

    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      throw new HttpException('Maintenance not found', HttpStatus.NOT_FOUND);
    }

    return maintenance;
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      throw new HttpException('Maintenance not found', HttpStatus.NOT_FOUND);
    }

    if (updateMaintenanceDto.name) {
      const cellExists = await this.prisma.maintenance.findFirst({
        where: { name: updateMaintenanceDto.name, NOT: { id } },
      });
      if (cellExists) {
        throw new HttpException(
          'Name phone already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updateService = await this.prisma.maintenance.update({
      where: { id },
      data: { ...updateMaintenanceDto },
    });
    return updateService;
  }

  async remove(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      throw new HttpException('Maintenance not found', HttpStatus.NOT_FOUND);
    }

    const deleteMaintenance = await this.prisma.maintenance.delete({
      where: { id },
    });

    return deleteMaintenance;
  }
}
