import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MaintenanceGroupService } from './maintenance-group.service';
import { MaintenanceGroupResponseDto } from './dto/response-maintenance-group.dto';
import { CreateMaintenanceGroupDto } from './dto/create-maintenance-group.dto';
import { UpdateMaintenanceGroupDto } from './dto/update-maintenance-group.dto';

@ApiTags('maintenance-group')
@Controller('maintenance-group')
export class MaintenanceGroupController {
  constructor(
    private readonly maintenanceGroupService: MaintenanceGroupService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo grupo de manutenção',
    description:
      'Cria um novo grupo de manutenção com validação de nome do grupo',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Grupo já cadastrado',
  })
  @ApiNotFoundResponse({
    description: 'Grupo não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @ApiCreatedResponse({
    description: 'Grupo de manutenção criado com sucesso',
    type: MaintenanceGroupResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaintenanceGroupDto: CreateMaintenanceGroupDto) {
    return this.maintenanceGroupService.create(createMaintenanceGroupDto);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar quantidade total de grupos de manutenção',
    description:
      'Retorna a quantidade total de grupos de manutenção cadastrados',
  })
  count() {
    return this.maintenanceGroupService.countAll();
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os grupos de manutenção',
    description:
      'Retorna uma lista com todos os grupos de manutenção cadastrados',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @ApiOkResponse({
    description: 'Lista de grupos de manutenção retornada com sucesso',
    type: [MaintenanceGroupResponseDto],
  })
  findAll() {
    return this.maintenanceGroupService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar grupo por nome',
    description: 'Retorna um grupo de manutenção específico baseado no nome',
  })
  @ApiQuery({
    name: 'group',
    description: 'Nome do grupo',
    example: 'Troca de óleo',
    required: true,
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Grupo de manutenção não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Nome do grupo não informado',
  })
  findByGroupName(@Query('group') groupName: string) {
    return this.maintenanceGroupService.findByName(groupName);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar grupo de manutenção por ID',
    description: 'Retorna um grupo de manutenção específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do grupo de manutenção',
    example: 2,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Grupo de manutenção encontrado com sucesso',
    type: MaintenanceGroupResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Grupo de manutenção não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um grupo de manutenção',
    description: 'Atualiza os dados de um grupo de manutenção existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do grupo de manutenção',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do grupo de manutenção a serem atualizados',
    type: UpdateMaintenanceGroupDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de manutenção não encontrado',
  })
  @ApiConflictResponse({
    description: 'Nome do grupo já está em uso por outro grupo de manutenção',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialGroupDto: UpdateMaintenanceGroupDto,
  ) {
    return this.maintenanceGroupService.update(id, updateMaterialGroupDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um grupo de manutenção',
    description: 'Remove um grupo de manutenção do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do grupo de manutenção',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Grupo de manutenção removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de manutenção não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceGroupService.remove(id);
  }
}
