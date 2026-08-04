import { ApiProperty } from '@nestjs/swagger';

export class MaterialResponseDto {
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
    description: 'Nome do material',
    example: 'Óleo de motor 5W30 sintético',
  })
  name: string;

  @ApiProperty({
    description: 'ID do grupo de material',
    example: 1,
  })
  group_id: number | null;
}
