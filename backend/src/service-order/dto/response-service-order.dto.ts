import { ApiProperty } from '@nestjs/swagger';

export class ServiceOrderResponseDto {
  @ApiProperty({
    description: 'ID único do material',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do material',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Nome do profissional',
    example: 'João Calazans',
  })
  professional: String;

  @ApiProperty({
    description:
      'Prioridade da ordem de serviço (normal [1], baixa [2], alta [3], urgente [4])',
    example: 1,
    type: Number,
  })
  priority: Number;

  @ApiProperty({
    description:
      'Status da ordem de serviço (pendente [1], em andamento [2], concluído [3], aberta [4], aguardando peças [5], cancelada [6])',
    example: 1,
    type: Number,
  })
  status: Number;

  @ApiProperty({
    description: 'Data em que o carro chegou',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  arrived_at: Date;

  @ApiProperty({
    description: 'Kilometragem que o carro chegou',
    example: 2000,
    type: Number,
  })
  entry_km: Number;

  @ApiProperty({
    description: 'Diagnóstico da ordem de serviço',
    example: 'Texto para diagnóstico',
    type: String,
  })
  diagnosis: String;

  @ApiProperty({
    description: 'Observação da ordem de serviço',
    example: 'Texto para observação',
    type: Number,
  })
  subtotal: Number;

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
    type: Number,
  })
  customer_id: number;

  @ApiProperty({
    description: 'ID do veículo',
    example: 1,
    type: Number,
  })
  vehicle_id: number;
}
