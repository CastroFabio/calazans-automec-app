import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException('Car already exists', HttpStatus.BAD_REQUEST);
    }

    const newCar = await this.prisma.car.create({
      data: { ...createCarDto },
    });

    return newCar;
  }

  findAll() {
    return `This action returns all car`;
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
