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
import { MaterialGroupService } from './material-group.service';
import { MaterialGroupResponseDto } from './dto/response-material-group.dto';
import { CreateMaterialGroupDto } from './dto/create-material-group.dto';
import { UpdateMaterialGroupDto } from './dto/update-material-group.dto';

@ApiTags('material-group')
@Controller('material-group')
export class MaterialGroupController {
  constructor(private readonly materialGroupService: MaterialGroupService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo grupo de materiais',
    description:
      'Cria um novo grupo de materiais com validação de nome do grupo',
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
    description: 'Grupo de materiais criado com sucesso',
    type: MaterialGroupResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaterialGroupDto: MaterialGroupResponseDto) {
    return this.materialGroupService.create(createMaterialGroupDto);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar quantidade total de grupos de material',
    description: 'Retorna a quantidade total de grupos de material cadastrados',
  })
  count() {
    return this.materialGroupService.countAll();
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os grupos de material',
    description:
      'Retorna uma lista com todos os grupos de material cadastrados',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @ApiOkResponse({
    description: 'Lista de grupos de materiais retornada com sucesso',
    type: [MaterialGroupResponseDto],
  })
  findAll() {
    return this.materialGroupService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar grupo por nome',
    description: 'Retorna um grupo de materiais específico baseado no nome',
  })
  @ApiQuery({
    name: 'group',
    description: 'Nome do grupo',
    example: 'Freios',
    required: true,
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Grupo de materiais não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Nome do grupo não informado',
  })
  findByGroupName(@Query('group') groupName: string) {
    return this.materialGroupService.findByName(groupName);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar grupo de material por ID',
    description: 'Retorna um grupo de material específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do grupo de material',
    example: 2,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Grupo de material encontrado com sucesso',
    type: MaterialGroupResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Grupo de material não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um grupo de materiais',
    description: 'Atualiza os dados de um grupo de material existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do grupo de material',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do grupo de material a serem atualizados',
    type: UpdateMaterialGroupDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de material não encontrado',
  })
  @ApiConflictResponse({
    description: 'Nome do grupo já está em uso por outro grupo de material',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialGroupDto: UpdateMaterialGroupDto,
  ) {
    return this.materialGroupService.update(id, updateMaterialGroupDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um grupo de material',
    description: 'Remove um grupo de material do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do grupo de material',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Grupo de material removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de material não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialGroupService.remove(id);
  }
}
