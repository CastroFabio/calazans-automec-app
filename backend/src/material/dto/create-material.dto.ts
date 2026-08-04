import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({
    description: 'Nome do material',
    example: 'Óleo de motor 5W30 sintético',
  })
  @IsString({ message: 'Nome do material deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do material é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'ID do grupo de material proprietário',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'ID do grupo de material deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do grupo de material é obrigatório' })
  @IsPositive({
    message: 'ID do grupo de material deve ser um número positivo',
  })
  group_id: number;
}
