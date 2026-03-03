import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  tel_number: number;

  @IsNotEmpty()
  cell_number: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
