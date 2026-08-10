import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMaintenanceDto {
  @ApiProperty({
    description: 'Nome da manutenção',
    example: 'Revisão geral preventiva',
  })
  @IsString({ message: 'Nome da manutenção deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da manutenção é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Valor da manutenção',
    example: '30.25',
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Valor unitário não pode ser negativo' })
  @Type(() => Number)
  value_unit: number;

  @ApiProperty({
    description: 'ID do grupo de manutenção proprietário',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID do grupo de manutenção deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do grupo de manutenção é obrigatório' })
  @IsPositive({
    message: 'ID do grupo de manutenção deve ser um número positivo',
  })
  group_id: number;
}
