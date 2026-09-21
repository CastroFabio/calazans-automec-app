// src/customers/dto/create-customer.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva Santos',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Número de celular (apenas números)',
    example: '11999999999',
    minLength: 10,
    maxLength: 15,
    pattern: '^[0-9]+$',
  })
  @IsNotEmpty({ message: 'Celular é obrigatório' })
  @IsString({ message: 'Celular deve ser uma string' })
  cell: string;

  @ApiPropertyOptional({
    description: 'Número de telefone fixo (apenas números)',
    example: '1133333333',
    minLength: 10,
    maxLength: 15,
    pattern: '^[0-9]+$',
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  telephone?: string | null;

  @ApiPropertyOptional({
    description: 'Observações sobre o cliente',
    example: 'Cliente preferencial, gosta de desconto',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Observação deve ser uma string' })
  observation?: string | null;
}
