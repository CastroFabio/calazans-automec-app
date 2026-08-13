import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateItemMaintenanceBatchItemDto {
  @ApiPropertyOptional({
    description: 'ID da manutenção (opcional se description for fornecido)',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'maintenance_id deve ser um número inteiro' })
  @IsPositive({ message: 'maintenance_id deve ser um número positivo' })
  maintenance_id?: number;

  @ApiPropertyOptional({
    description: 'Descrição do serviço',
    example: 'Troca de óleo personalizada',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'description deve ser uma string' })
  @MaxLength(500, { message: 'description deve ter no máximo 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Valor unitário do serviço',
    example: 89.9,
    type: Number,
    minimum: 0,
  })
  @IsNumber({}, { message: 'value_unity deve ser um número' })
  @Min(0, { message: 'value_unity deve ser maior ou igual a zero' })
  value_unity: number;

  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'serviceorder_id deve ser um número inteiro' })
  @IsPositive({ message: 'serviceorder_id deve ser um número positivo' })
  serviceorder_id: number;
}

export class CreateItemMaintenanceBatchDto {
  @ApiProperty({
    description: 'Lista de itens de manutenção para criar',
    type: [CreateItemMaintenanceBatchItemDto],
  })
  @IsArray({ message: 'items deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateItemMaintenanceBatchItemDto)
  items: CreateItemMaintenanceBatchItemDto[];
}
