import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateMaterialItemDto {
  @ApiProperty({
    description: 'Quantidade de itens de material',
    example: 1,
  })
  @IsInt({ message: 'Quantidade de material deve ser inteiro' })
  @Min(0, { message: 'Quantidade de material não pode ser negativo' })
  @IsNotEmpty({ message: 'Quantidade de material é obrigatório' })
  quantity: number;

  @ApiProperty({ description: 'Valor unitário de material', example: 2.5 })
  @IsNumber()
  @Min(0, { message: 'Valor unitário de material não pode ser negativo' })
  @IsNotEmpty({ message: 'Valor unitário de material é obrigatório' })
  value_unity: number;

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
    description: 'ID do material',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID do material deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do material é obrigatório' })
  @IsPositive({
    message: 'ID do material deve ser um número positivo',
  })
  material_id: number;

  @ApiPropertyOptional({
    description: 'Códido do recibo da peça que foi comprada no fornecedor',
    example: '234599',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Códido do recibo deve ser uma string' })
  receipt: string;

  @ApiPropertyOptional({
    description: 'Nome do fornecedor',
    example: 'AP',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Nome do fornecedor deve ser uma string' })
  supplier: string;
}
