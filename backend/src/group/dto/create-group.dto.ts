import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    example: 'Motor',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
