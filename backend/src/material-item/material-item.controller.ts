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
import { MaterialItemService } from './material-item.service';
import { CreateMaterialItemDto } from './dto/create-material-item.dto';
import { UpdateMaterialItemDto } from './dto/update-material-item.dto';
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
import { MaterialResponseDto } from 'src/material/dto/response-material.dto';
import { MaterialItemResponseDto } from './dto/response-material-item.dto';

@ApiTags('material-item')
@Controller('material-item')
export class MaterialItemController {
  constructor(private readonly materialItemService: MaterialItemService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo item de material',
    description: 'Cria um novo item de material',
  })
  @ApiCreatedResponse({
    description: 'Item material criado com sucesso',
    type: MaterialResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Material na ordem de serviço já cadastrado',
  })
  @ApiNotFoundResponse({
    description: 'Item material não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaterialItemDto: CreateMaterialItemDto) {
    return this.materialItemService.create(createMaterialItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os itens de material',
    description: 'Retorna uma lista com todos os itens de material cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de itens de material retornada com sucesso',
    type: [MaterialItemResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  findAll() {
    return this.materialItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar item de material por ID',
    description: 'Retorna um item de material específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do item de material',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Item de material encontrado com sucesso',
    type: MaterialItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Item de material não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um item de material',
    description: 'Atualiza os dados de um item de material existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do item de material',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do item de material a serem atualizados',
    type: UpdateMaterialItemDto,
  })
  @ApiOkResponse({
    description: 'Item de material atualizado com sucesso',
    type: MaterialItemResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Item de material não encontrado',
  })
  @ApiConflictResponse({
    description: 'Placa já está em uso por outro item de material',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialItemDto: UpdateMaterialItemDto,
  ) {
    return this.materialItemService.update(id, updateMaterialItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um item de material',
    description: 'Remove um item de material do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do item de material',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Item de material removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Item de material não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialItemService.remove(id);
  }
}
