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
} from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceOrderResponseDto } from './dto/response-service-order.dto';

@ApiTags('service-order')
@Controller('service-order')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

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

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceOrderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceOrderDto: UpdateServiceOrderDto,
  ) {
    return this.serviceOrderService.update(+id, updateServiceOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceOrderService.remove(+id);
  } */
}
