import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'sedan',
  })
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'DEF-1234',
  })
  license_plate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Toyota',
  })
  brand: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Camry',
  })
  model: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 2020,
  })
  year: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'red',
  })
  color: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 15000,
  })
  km: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2023-01-01T10:00:00.000Z',
  })
  arrived_at: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  customer_id: number;
}
