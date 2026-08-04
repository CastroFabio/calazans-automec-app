import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceResponseDto {
  @ApiProperty({
    description: 'ID único da manutenção',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação da manutenção',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Nome da manutenção',
    example: 'Óleo de motor 5W30 sintético',
  })
  name: string;

  @ApiProperty({
    description: 'ID da grupo de manutenção',
    example: 1,
  })
  group_id: number;
}
