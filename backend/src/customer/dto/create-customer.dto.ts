import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  tel_number: string;

  @IsNotEmpty()
  cell_number: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
