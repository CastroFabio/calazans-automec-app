import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Placa do veículo',
    example: 'ABC-1234',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  @IsString({ message: 'Placa deve ser uma string' })
  license_plate: string;

  @ApiProperty({
    description: 'Marca do veículo',
    example: 'Toyota',
  })
  @IsString({ message: 'Marca deve ser uma string' })
  @IsOptional()
  brand: string;

  @ApiProperty({
    description: 'Modelo do veículo',
    example: 'Corolla',
  })
  @IsString({ message: 'Modelo deve ser uma string' })
  @IsOptional()
  model: string;
}
