import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Telefone do cliente',
    example: 211231234,
  })
  @IsOptional()
  phone: number;

  @ApiProperty({
    description: 'Celular do cliente',
    example: 2191231234,
  })
  @IsNotEmpty()
  cell: number;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da Silva',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
