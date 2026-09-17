import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from './response-customer.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Página atual' })
  currentPage: number;

  @ApiProperty({ example: 25, description: 'Quantidade de itens por página' })
  perPage: number;

  @ApiProperty({ example: 100, description: 'Total de itens no banco' })
  totalItems: number;

  @ApiProperty({ example: 4, description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({
    example: true,
    description: 'Indica se existe próxima página',
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: false,
    description: 'Indica se existe página anterior',
  })
  hasPreviousPage: boolean;
}

export class PaginatedCustomerResponseDto {
  @ApiProperty({ type: [CustomerResponseDto] })
  data: CustomerResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
