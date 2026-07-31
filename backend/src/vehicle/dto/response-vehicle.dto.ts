// src/vehicles/dto/response-vehicle.dto.ts (se ainda não tiver)
import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponseDto {
  @ApiProperty({
    description: 'ID único do veículo',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do veículo',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Placa do veículo',
    example: 'ABC-1234',
  })
  license_plate: string;

  @ApiProperty({
    description: 'Marca do veículo',
    example: 'Toyota',
    nullable: true,
  })
  brand: string | null;

  @ApiProperty({
    description: 'Modelo do veículo',
    example: 'Corolla',
    nullable: true,
  })
  model: string | null;

  @ApiProperty({
    description: 'ID do cliente proprietário',
    example: 1,
    nullable: true,
  })
  customer_id: number | null;
}
