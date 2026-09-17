import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário para login',
    example: 'meuemail@email.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @ApiProperty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'mySecurePassword123',
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6)
  @MaxLength(21)
  @ApiProperty()
  password: string;
}
