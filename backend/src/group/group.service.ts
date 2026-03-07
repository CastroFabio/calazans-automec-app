import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: {
        name: createGroupDto.name,
      },
    });

    if (group) {
      throw new HttpException('Group already exists', HttpStatus.BAD_REQUEST);
    }

    const newGroup = await this.prisma.group.create({
      data: { ...createGroupDto },
    });

    return newGroup;
  }

  async findAll() {
    const group = await this.prisma.group.findMany();
    return group;
  }

  async findOne(@Param('id') id: number) {
    if (!id) {
      throw new Error('Group ID is required');
    }

    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    if (updateGroupDto.name) {
      const cellExists = await this.prisma.group.findFirst({
        where: { name: updateGroupDto.name, NOT: { id } },
      });
      if (cellExists) {
        throw new HttpException(
          'Name phone already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updateService = await this.prisma.group.update({
      where: { id },
      data: { ...updateGroupDto },
    });
    return updateService;
  }

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const deleteGroup = await this.prisma.group.delete({
      where: { id },
    });

    return deleteGroup;
  }
}
