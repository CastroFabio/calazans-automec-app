import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({
    example: '25.00',
  })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with a maximum of 2 decimal places.' },
  )
  @Min(0, { message: 'Price must be a positive number.' })
  value_price: number;

  @ApiProperty({
    example: 'Motor',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  group_id: number;
}
