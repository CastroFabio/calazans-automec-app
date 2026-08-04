import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceGroupResponseDto {
  @ApiProperty({
    description: 'ID único do grupo de manutenção',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do grupo',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Nome do grupo',
    example: 'Troca de óleo',
  })
  group: string;
}
