import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/index-browser';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceOrderDto {
  @ApiProperty({
    description: 'Nome do profissional',
    example: 'João Calazans',
  })
  @IsString({ message: 'Nome do profissional deve ser uma string' })
  @IsOptional()
  professional: string;

  @ApiProperty({
    description:
      'Status da ordem de serviço (pendente [1], em andamento [2], concluído [3], aberta [4], aguardando peças [5], cancelada [6])',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'O número que representa a status deve ser inteiro' })
  @IsNotEmpty({ message: 'O número que representa a status obrigatório' })
  @IsPositive({ message: 'O número que representa a status deve ser positivo' })
  status?: number;

  @ApiProperty({
    description:
      'Status de pagamento da ordem de serviço (Aguardando Pagamento [1], Pago Parcialmente [2], Pago Integralmente [3], Sem Pagamento [4])',
    example: 1,
    type: Number,
  })
  @IsInt({
    message: 'O número que representa o status de pagamento deve ser inteiro',
  })
  @IsNotEmpty({
    message: 'O número que representa o status de pagamento obrigatório',
  })
  @IsPositive({
    message: 'O número que representa o status de pagamento deve ser positivo',
  })
  paymentStatus?: number;

  @ApiProperty({
    description: 'Data em que o carro chegou',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  arrived_at?: Date;

  @ApiProperty({
    description: 'Kilometragem que o carro chegou',
    example: 2000,
    type: Decimal,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  entry_km: number;

  @ApiProperty({
    description: 'Diagnóstico da ordem de serviço',
    example: 'Texto para diagnóstico',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Diagnóstico da ordem de serviço deve ser uma string' })
  diagnosis: string;

  @ApiProperty({
    description: 'Observação da ordem de serviço',
    example: 'Texto para observação',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Observação da ordem de serviço deve ser uma string' })
  observation: string;

  @ApiProperty({
    description: 'Quanto a ordem foi paga',
    example: 30.4,
    type: Number,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com até 2 casas decimais' },
  )
  @Min(0, { message: 'O preço não pode ser negativo' })
  @Type(() => Number)
  paid: number;

  @ApiProperty({
    description: 'Quanto custou o serviço de manutenção',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'O valor da mão de obra é obrigatório' })
  @Type(() => Number) // Converte "150.50" para 150.50
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com até 2 casas decimais' },
  )
  @Min(0, { message: 'O preço não pode ser negativo' })
  labor_cost: number;

  @ApiProperty({
    description: 'O valor da ordem de serviço',
    example: 2400.44,
    type: Number,
  })
  @IsNotEmpty({ message: 'O valor da mão de obra é obrigatório' })
  @Type(() => Number) // Converte "150.50" para 150.50
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com até 2 casas decimais' },
  )
  @Min(0, { message: 'O preço não pode ser negativo' })
  subtotal: number;

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do cliente é obrigatório' })
  @IsPositive({
    message: 'ID do cliente deve ser um número positivo',
  })
  customer_id: number;

  @ApiProperty({
    description: 'ID do veículo',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID do veículo deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do veículo é obrigatório' })
  @IsPositive({
    message: 'ID do veículo deve ser um número positivo',
  })
  vehicle_id: number;
}
