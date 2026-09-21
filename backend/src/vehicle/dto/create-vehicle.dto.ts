import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Placa do veículo',
    example: 'ABC-1234',
    minLength: 7,
    maxLength: 8,
    pattern: '^[A-Z]{3}-[0-9]{4}$',
  })
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  @IsString({ message: 'Placa deve ser uma string' })
  @MinLength(7, { message: 'Placa deve ter pelo menos 7 caracteres' })
  @MaxLength(8, { message: 'Placa deve ter no máximo 8 caracteres' })
  license_plate: string;

  @ApiPropertyOptional({
    description: 'Marca do veículo',
    example: 'Toyota',
  })
  @IsOptional()
  @IsString({ message: 'Marca deve ser uma string' })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Modelo do veículo',
    example: 'Corolla',
  })
  @IsOptional()
  @IsString({ message: 'Modelo deve ser uma string' })
  model?: string;

  @ApiPropertyOptional({
    description: 'Cor do veículo',
    example: 'Prata',
  })
  @IsOptional()
  @IsString({ message: 'Cor deve ser uma string' })
  color?: string;

  @ApiPropertyOptional({
    description: 'Ano do veículo',
    example: 2012,
    type: Number,
  })
  @IsOptional()
  @IsPositive({ message: 'Ano do veículo deve ser um número positivo' })
  @IsInt({ message: 'Ano deve ser uma string' })
  year?: number;

  @ApiPropertyOptional({
    description: 'ID do cliente proprietário',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @IsPositive({ message: 'ID do cliente deve ser um número positivo' })
  customer_id?: number;
}
