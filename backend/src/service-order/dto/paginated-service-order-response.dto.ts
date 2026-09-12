import { ApiProperty } from '@nestjs/swagger';
import { ServiceOrderResponseDto } from './response-service-order.dto';

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

export class PaginatedServiceOrderResponseDto {
  @ApiProperty({ type: [ServiceOrderResponseDto] })
  data: ServiceOrderResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
