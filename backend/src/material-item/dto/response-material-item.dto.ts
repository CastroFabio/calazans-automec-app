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
  value_unit: number;

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
    description: 'Loja que foi comprado',
    example: 'Nome da loja que foi comprada a peça',
    type: String,
  })
  supplier: string;

  @ApiPropertyOptional({
    description: 'Recibo da compra de peças',
    example: 'Recibo da compra de peça referente ao fornecedor',
    type: String,
  })
  receipt: string;

  @ApiPropertyOptional({
    description: 'Indica se o cliente é o fornecedor',
    example: true,
    type: Boolean,
  })
  isCustomerSupplier: Boolean;
}
