// src/customers/dto/response-customer.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { VehicleResponseDto } from '../../vehicle/dto/response-vehicle.dto';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'ID único do cliente',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do cliente',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva Santos',
  })
  name: string;

  @ApiProperty({
    description: 'Número de celular',
    example: '11999999999',
  })
  cell: string;

  @ApiProperty({
    description: 'Número de telefone fixo',
    example: '1133333333',
    nullable: true,
  })
  telephone: string | null;

  @ApiProperty({
    description: 'Observações sobre o cliente',
    example: 'Cliente preferencial',
    nullable: true,
  })
  observation: string | null;

  @ApiProperty({
    description: 'Lista de veículos do cliente',
    type: [VehicleResponseDto],
    required: false,
  })
  vehicles?: VehicleResponseDto[];
}
