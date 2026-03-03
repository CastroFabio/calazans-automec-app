import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  type: string;

  /* @IsOptional()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  license_plate: string;

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsOptional()
  year: number;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  km: number;

  @IsOptional()
  @IsString()
  arrived_at: string; */
}
