import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaintenanceItemResponseDto {
  @ApiProperty({
    description: 'ID único do serviço de manutenção',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do serviço de manutenção',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Valor unitário do serviço de manutenção',
    example: 2.5,
  })
  value_unity: number;

  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  serviceorder_id: number;

  @ApiProperty({
    description: 'ID do serviço de manutenção',
    example: 1,
    type: Number,
  })
  maintenance_id: number;

  @ApiPropertyOptional({
    description: 'Descrição',
    example: 'Descrição sobre o item material',
    type: String,
  })
  description: string;
}
