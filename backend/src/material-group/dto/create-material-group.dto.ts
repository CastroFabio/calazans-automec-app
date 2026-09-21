import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialGroupDto {
  @ApiProperty({
    description: 'Nome do grupo de materiais',
    example: 'Freios',
  })
  @IsString({ message: 'Nome do grupo deve ser uma string' })
  @IsNotEmpty({ message: 'O nome do grupo é obrigatório' })
  group: string;
}
