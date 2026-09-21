import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceGroupDto {
  @ApiProperty({
    description: 'Nome do grupo de manutenção',
    example: 'Troca de óleo',
  })
  @IsString({ message: 'Nome do grupo deve ser uma string' })
  @IsNotEmpty({ message: 'O nome do grupo é obrigatório' })
  group: string;
}
