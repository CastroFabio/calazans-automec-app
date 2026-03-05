import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    const car = await this.prisma.car.findUnique({
      where: {
        license_plate: createCarDto.license_plate,
      },
    });

    if (car) {
      throw new HttpException(
        'License plate already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCar = await this.prisma.car.create({
      data: {
        ...createCarDto,
      },
    });

    return newCar;
  }

  async findAll() {
    const car = await this.prisma.car.findMany();

    return car;
  }

  async findOne(@Param('id') id: number) {
    if (!id) {
      throw new Error('Car ID is required');
    }

    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    if (updateCarDto.license_plate) {
      const licensePlateExists = await this.prisma.car.findFirst({
        where: { license_plate: updateCarDto.license_plate, NOT: { id } },
      });

      if (licensePlateExists) {
        throw new HttpException(
          'License plate already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updatedCar = await this.prisma.car.update({
      where: { id },
      data: { ...updateCarDto },
    });
    return updatedCar;
  }

  async remove(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    const deletedCar = await this.prisma.car.delete({
      where: { id },
    });

    return deletedCar;
  }
}
