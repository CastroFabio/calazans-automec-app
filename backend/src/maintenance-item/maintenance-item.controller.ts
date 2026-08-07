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
} from '@nestjs/common';
import { MaintenanceItemService } from './maintenance-item.service';
import { CreateMaintenanceItemDto } from './dto/create-maintenance-item.dto';
import { UpdateMaintenanceItemDto } from './dto/update-maintenance-item.dto';
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
import { MaintenanceResponseDto } from 'src/maintenance/dto/response-maintenance.dto';
import { MaintenanceItemResponseDto } from './dto/response-maintenance-item.dto';

@ApiTags('maintenance-item')
@Controller('maintenance-item')
export class MaintenanceItemController {
  constructor(
    private readonly maintenanceItemService: MaintenanceItemService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo serviço de manutenção',
    description: 'Cria um novo serviço de manutenção',
  })
  @ApiCreatedResponse({
    description: 'Serviço de manutenção criado com sucesso',
    type: MaintenanceItemResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Serviço de manutenção na ordem de serviço já cadastrado',
  })
  @ApiNotFoundResponse({
    description: 'Serviço de manutenção não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaintenanceItemDto: CreateMaintenanceItemDto) {
    return this.maintenanceItemService.create(createMaintenanceItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os serviços de manutenção',
    description:
      'Retorna uma lista com todos os serviços de manutenção cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de serviços de manutenção retornada com sucesso',
    type: [MaintenanceItemResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  findAll() {
    return this.maintenanceItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar serviço de manutenção por ID',
    description: 'Retorna um serviço de manutenção específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do serviço de manutenção',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Serviço de manutenção encontrado com sucesso',
    type: MaintenanceItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Serviço de manutenção não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um serviço de manutenção',
    description: 'Atualiza os dados de um serviço de manutenção existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do serviço de manutenção',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do serviço de manutenção a serem atualizados',
    type: UpdateMaintenanceItemDto,
  })
  @ApiOkResponse({
    description: 'Serviço de manutenção atualizado com sucesso',
    type: MaintenanceItemResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Serviço de manutenção não encontrado',
  })
  @ApiConflictResponse({
    description: 'Placa já está em uso por outro serviço de manutenção',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaintenanceItemDto: UpdateMaintenanceItemDto,
  ) {
    return this.maintenanceItemService.update(id, updateMaintenanceItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um serviço de manutenção',
    description: 'Remove um serviço de manutenção do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do serviço de manutenção',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Serviço de manutenção removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Serviço de manutenção não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceItemService.remove(id);
  }
}
