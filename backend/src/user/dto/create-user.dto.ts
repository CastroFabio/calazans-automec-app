import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Senha hasheada do usuário',
    example: 'mySecurePassword123',
    minLength: 8,
    maxLength: 21,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password_hash: string;

  @ApiProperty({
    description: 'Perfil de acesso do usuário no sistema',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsNotEmpty({ message: 'O perfil de acesso (role) é obrigatório' })
  @IsEnum(Role, {
    message:
      'O perfil de acesso informado é inválido. Valores aceitos: ADMIN, CUSTOMER',
  })
  role: Role;

  @ApiPropertyOptional({
    description: 'Boolean se o usuário está ativo',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @ApiPropertyOptional({
    description: 'ID do cliente proprietário',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @IsPositive({ message: 'ID do cliente deve ser um número positivo' })
  customer_id?: number;
}
