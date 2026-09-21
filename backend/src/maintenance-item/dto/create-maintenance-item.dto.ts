import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMaintenanceItemDto {
  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID da ordem de serviço deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID da ordem de serviço é obrigatório' })
  @IsPositive({
    message: 'ID da ordem de serviço deve ser um número positivo',
  })
  serviceorder_id: number;

  @ApiProperty({
    description: 'ID da manutenção',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID da manutenção deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID da manutenção é obrigatório' })
  @IsPositive({
    message: 'ID da manutenção deve ser um número positivo',
  })
  maintenance_id: number;

  @ApiPropertyOptional({
    description: 'Descrição',
    example: 'Descrição sobre o serviço de manutenção',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description: string;
}
