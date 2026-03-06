import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Priority, Status } from 'src/generated/prisma/enums';

export class CreateOrderDto {
  @ApiProperty({
    example: 'João',
  })
  @IsNotEmpty()
  employer: string;

  @ApiProperty({
    example: 'Descrição',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'normal',
    enum: Priority,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Priority, {
    message: 'Invalid priority type. Must be alta, baixa e normal.',
  })
  priority: Priority;

  @ApiProperty({
    example: 'pending',
    enum: Status,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Status, {
    message: 'Invalid priority type. Must be in progress, done or pending.',
  })
  status: Status;

  @ApiProperty({
    example: '25.00',
  })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with a maximum of 2 decimal places.' },
  )
  @Min(0, { message: 'Price must be a positive number.' })
  total_value: number;

  @ApiProperty({
    example: '2025-03-05T14:48:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  created_at: Date;

  @ApiProperty({
    example: '2025-03-05T14:48:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updated_at: Date;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  car_id: number;
}
