import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2026-07-30T22:39:48.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'meuemail@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Perfil de acesso do usuário no sistema',
    example: Role.ADMIN,
  })
  role: Role;

  @ApiProperty({
    description: 'Boolean se o usuário está ativo',
    example: true,
  })
  is_active: boolean;
}
