import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleResponseDto } from './dto/response-vehicle.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo veículo',
    description: 'Cria um novo veículo com validação de placa única',
  })
  @ApiCreatedResponse({
    description: 'Veículo criado com sucesso',
    type: VehicleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Placa já cadastrada',
  })
  @ApiNotFoundResponse({
    description: 'Cliente não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os veículos',
    description: 'Retorna uma lista com todos os veículos cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de veículos retornada com sucesso',
    type: [VehicleResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar veículo por placa',
    description: 'Retorna um veículo específico baseado na placa',
  })
  @ApiQuery({
    name: 'plate',
    description: 'Placa do veículo',
    example: 'ABC-1234',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Veículo encontrado com sucesso',
    type: VehicleResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Veículo não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Placa não informada',
  })
  findByPlate(@Query('plate') plate: string) {
    return this.vehicleService.findByLicensePlate(plate);
  }

  @Get('customer/:customerId')
  @ApiOperation({
    summary: 'Buscar veículos por cliente',
    description: 'Retorna todos os veículos de um cliente específico',
  })
  @ApiParam({
    name: 'customerId',
    description: 'ID do cliente',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Veículos encontrados com sucesso',
    type: [VehicleResponseDto],
  })
  @ApiNotFoundResponse({
    description: 'Cliente não encontrado',
  })
  findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.vehicleService.findByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar veículo por ID',
    description: 'Retorna um veículo específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veículo',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Veículo encontrado com sucesso',
    type: VehicleResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Veículo não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um veículo',
    description: 'Atualiza os dados de um veículo existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veículo',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do veículo a serem atualizados',
    type: UpdateVehicleDto,
  })
  @ApiOkResponse({
    description: 'Veículo atualizado com sucesso',
    type: VehicleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Veículo não encontrado',
  })
  @ApiConflictResponse({
    description: 'Placa já está em uso por outro veículo',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um veículo',
    description: 'Remove um veículo do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veículo',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Veículo removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Veículo não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.remove(id);
  }
}
