import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaterialItemResponseDto {
  @ApiProperty({
    description: 'ID único do item material',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do item de material',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Quantidade de itens de material',
    example: 1,
  })
  quantity: number;

  @ApiProperty({ description: 'Valor unitário de material', example: 2.5 })
  value_unity: number;

  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  serviceorder_id: number;

  @ApiProperty({
    description: 'ID do material',
    example: 1,
    type: Number,
  })
  material_id: number;

  @ApiPropertyOptional({
    description: 'Referência',
    example: 'Descrição sobre o item material',
    type: String,
  })
  reference: string;
}
