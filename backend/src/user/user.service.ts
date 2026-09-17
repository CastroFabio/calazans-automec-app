import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Já existe um usuário com este email');
      }

      if (createUserDto.customer_id) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: createUserDto.customer_id },
        });

        if (!customer) {
          throw new NotFoundException('Cliente não encontrado');
        }
      }

      const hashedPassword = await bcrypt.hash(
        createUserDto.password_hash,
        roundsOfHashing,
      );

      createUserDto.password_hash = hashedPassword;

      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      return user;
    } catch (error) {
      // ADICIONE ESTA LINHA PARA VER O ERRO REAL NO TERMINAL:
      console.error('Erro detalhado ao criar usuário:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password_hash) {
      updateUserDto.password_hash = await bcrypt.hash(
        updateUserDto.password_hash,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
