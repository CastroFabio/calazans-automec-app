import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  phone: number;

  @IsNotEmpty()
  cell: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
