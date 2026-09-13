import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceOrderResponseDto } from './dto/response-service-order.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedServiceOrderResponseDto } from './dto/paginated-service-order-response.dto';

@ApiTags('service-order')
@Controller('service-order')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  private readonly logger = new Logger(ServiceOrderController.name);
  @Post()
  @ApiOperation({
    summary: 'Criar uma nova ordem de serviço',
    description: 'Cria uma nova ordem de serviço',
  })
  @ApiCreatedResponse({
    description: 'Ordem de serviço criado com sucesso',
    type: ServiceOrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Ordem de serviço já cadastrado',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de material não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServiceOrderDto: CreateServiceOrderDto) {
    return this.serviceOrderService.create(createServiceOrderDto);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar quantidade total de ordens de serviço',
    description: 'Retorna a quantidade total de ordens de serviço cadastrados',
  })
  count() {
    return this.serviceOrderService.countAll();
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as ordens de serviço',
    description: 'Retorna uma lista com todas as ordens de serviço cadastradas',
  })
  @ApiOkResponse({
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [ServiceOrderResponseDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  findAll() {
    return this.serviceOrderService.findAll();
  }

  @Get('page')
  @ApiOperation({
    summary: 'Listar todas as ordens de serviço paginadas',
    description:
      'Retorna uma lista paginada com as ordens de serviço cadastradas e metadados de paginação',
  })
  @ApiOkResponse({
    description: 'Lista paginada de ordens de serviço retornada com sucesso',
    type: PaginatedServiceOrderResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  findAllPerPage(@Query() paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const search = paginationDto.search?.trim() || '';
    const limit = Number(paginationDto.limit) || 5;
    const status =
      paginationDto.status !== undefined &&
      paginationDto.status !== null &&
      paginationDto.status !== ('' as any)
        ? Number(paginationDto.status)
        : undefined;

    return this.serviceOrderService.findAllPerPage({
      page,
      limit,
      search,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar ordem de serviço por ID',
    description: 'Retorna uma ordem de serviço baseado por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Ordem de serviço encontrada com sucesso',
    type: ServiceOrderResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Ordem de serviço não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOrderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar uma ordem de serviço',
    description: 'Atualiza os dados de uma ordem de serviço existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados da ordem de serviço a serem atualizados',
    type: UpdateServiceOrderDto,
  })
  @ApiOkResponse({
    description: 'Ordem de serviço atualizado com sucesso',
    type: ServiceOrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Ordem de serviço não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceOrderDto: UpdateServiceOrderDto,
  ) {
    return this.serviceOrderService.update(id, updateServiceOrderDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover uma ordem de serviço',
    description: 'Remove uma ordem de serviço do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Ordem de serviço removida com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Ordem de serviço não encontrada',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOrderService.remove(+id);
  }
}
