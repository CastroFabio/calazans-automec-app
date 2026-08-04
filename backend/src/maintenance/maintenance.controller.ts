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
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
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
import { MaintenanceResponseDto } from './dto/response-maintenance.dto';

@ApiTags('maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova manutenção',
    description:
      'Cria uma nova manutenção com validação de nome de manutenção único',
  })
  @ApiCreatedResponse({
    description: 'Manutenção criado com sucesso',
    type: MaintenanceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Nome de manutenção já cadastrado',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de manutenção não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as manutenções',
    description: 'Retorna uma lista com todos os veículos cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de manutenções retornada com sucesso',
    type: [MaintenanceResponseDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um manutenção',
    description: 'Atualiza os dados de um manutenção existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do manutenção',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do manutenção a serem atualizados',
    type: UpdateMaintenanceDto,
  })
  @ApiOkResponse({
    description: 'Manutenção atualizado com sucesso',
    type: MaintenanceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Manutenção não encontrado',
  })
  @ApiConflictResponse({
    description: 'Nome do manutenção já está em uso por outro manutenção',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialDto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um manutenção',
    description: 'Remove um manutenção do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do manutenção',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Manutenção removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Manutenção não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.remove(id);
  }
}
