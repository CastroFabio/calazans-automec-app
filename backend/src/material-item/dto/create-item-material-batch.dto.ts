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
  @IsNumber({}, { message: 'value_unit deve ser um número' })
  @Min(0, { message: 'value_unit deve ser maior ou igual a zero' })
  value_unit: number;

  @ApiPropertyOptional({
    description: 'Código do recibo',
    example: '42145',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'código do recibo deve ser uma string' })
  @MaxLength(255, {
    message: 'código do recibo deve ter no máximo 255 caracteres',
  })
  receipt?: string;

  @ApiPropertyOptional({
    description: 'Nome do fornecedor',
    example: 'AP',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Nome do fornecedor deve ser uma string' })
  @MaxLength(255, {
    message: 'Nome do fornecedor deve ter no máximo 255 caracteres',
  })
  supplier?: string;

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
