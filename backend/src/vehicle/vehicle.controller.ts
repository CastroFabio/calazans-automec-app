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
  UseGuards,
  Logger,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ApiTags,
  ApiOperation,
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleResponseDto } from './dto/response-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    this.logger.log(
      `[HTTP POST /vehicles] Request recebida`,
      VehicleController.name,
    );

    try {
      return await this.vehicleService.create(createVehicleDto);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP POST /vehicles] Falha ao processar requisição`,
        stack,
        VehicleController.name,
      );
      throw error;
    }
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    this.logger.log(
      `[HTTP GET /vehicles] Request recebida`,
      VehicleController.name,
    );

    try {
      return this.vehicleService.findAll();
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP GET /vehicles] Falha ao processar requisição`,
        stack,
        VehicleController.name,
      );
      throw error;
    }
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(
      `[HTTP GET /vehicles/:id] Request recebida - ID: ${id}`,
      VehicleController.name,
    );

    try {
      const result = await this.vehicleService.findOne(id);

      return result;
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP GET /vehicles/:id] Falha ao processar requisição`,
        stack,
        VehicleController.name,
      );

      throw error;
    }
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    this.logger.log(
      `[HTTP PATCH /vehicles/:id] Request recebida - ID: ${id}`,
      VehicleController.name,
    );
    try {
      return await this.vehicleService.update(id, updateVehicleDto);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP PATCH /vehicles/:id] Falha ao processar requisição`,
        stack,
        VehicleController.name,
      );
      throw error;
    }
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(
      `[HTTP DELETE /vehicles/:id] Request recebida - ID: ${id}`,
      VehicleController.name,
    );

    try {
      await this.vehicleService.remove(id);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP DELETE /vehicles/:id] Falha ao processar requisição`,
        stack,
        VehicleController.name,
      );
      throw error;
    }
  }
}
