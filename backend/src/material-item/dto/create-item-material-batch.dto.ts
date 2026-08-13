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

export class CreateItemMaterialBatchItemDto {
  @ApiProperty({
    description: 'ID do material',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'material_id deve ser um número inteiro' })
  @IsPositive({ message: 'material_id deve ser um número positivo' })
  material_id: number;

  @ApiProperty({
    description: 'Quantidade do material',
    example: 2.5,
    type: Number,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'quantity deve ser um número' })
  @Min(0.01, { message: 'quantity deve ser maior que zero' })
  quantity: number;

  @ApiProperty({
    description: 'Valor unitário do material',
    example: 15.9,
    type: Number,
    minimum: 0,
  })
  @IsNumber({}, { message: 'value_unity deve ser um número' })
  @Min(0, { message: 'value_unity deve ser maior ou igual a zero' })
  value_unity: number;

  @ApiPropertyOptional({
    description: 'Referência do material',
    example: 'LOT-2024-001',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'reference deve ser uma string' })
  @MaxLength(255, { message: 'reference deve ter no máximo 255 caracteres' })
  reference?: string;

  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'serviceorder_id deve ser um número inteiro' })
  @IsPositive({ message: 'serviceorder_id deve ser um número positivo' })
  serviceorder_id: number;
}

export class CreateItemMaterialBatchDto {
  @ApiProperty({
    description: 'Lista de itens de material para criar',
    type: [CreateItemMaterialBatchItemDto],
  })
  @IsArray({ message: 'items deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateItemMaterialBatchItemDto)
  items: CreateItemMaterialBatchItemDto[];
}
