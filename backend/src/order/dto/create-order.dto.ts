import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Priority, Status } from 'src/generated/prisma/enums';
import { CreateItemMaintenanceDto } from 'src/item-maintenance/dto/create-item-maintenance.dto';
import { CreateItemMaterialDto } from 'src/item-material/dto/create-item-material.dto';

export class CreateOrderDto {
  @ApiProperty({
    example: 'João',
  })
  @IsNotEmpty()
  employer: string;

  @ApiProperty({
    example: 'Descrição',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'normal',
    enum: Priority,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Priority, {
    message: 'Invalid priority type. Must be alta, baixa e normal.',
  })
  priority: Priority;

  @ApiProperty({
    example: 'pending',
    enum: Status,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Status, {
    message: 'Invalid priority type. Must be in progress, done or pending.',
  })
  status: Status;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  customer_id?: number;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  car_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemMaterialDto)
  itensMaterial: CreateItemMaterialDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemMaintenanceDto)
  itensMaintenance: CreateItemMaintenanceDto[];
}
