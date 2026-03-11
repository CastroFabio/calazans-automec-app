import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateItemMaterialDto {
  @ApiProperty({
    example: 1,
    description: 'ID do serviço no catálogo (opcional se for serviço avulso)',
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  material_id?: number;

  @ApiProperty({
    example: 150.0,
    description: 'Valor unitário do serviço',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value_unit: number;

  @ApiProperty({
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  quantidade: number;

  // Campo calculado (não precisa ser enviado, será calculado no backend)
  subtotal?: number;
}
