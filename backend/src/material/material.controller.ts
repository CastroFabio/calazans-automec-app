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
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
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
import { MaterialResponseDto } from './dto/response-material.dto';

@ApiTags('material')
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo material',
    description:
      'Cria um novo material com validação de nome de material único',
  })
  @ApiCreatedResponse({
    description: 'Material criado com sucesso',
    type: MaterialResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Nome de material já cadastrado',
  })
  @ApiNotFoundResponse({
    description: 'Grupo de material não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os materiais',
    description: 'Retorna uma lista com todos os veículos cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de materiais retornada com sucesso',
    type: [MaterialResponseDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  findAll() {
    return this.materialService.findAll();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um material',
    description: 'Atualiza os dados de um material existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do material',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do material a serem atualizados',
    type: UpdateMaterialDto,
  })
  @ApiOkResponse({
    description: 'Material atualizado com sucesso',
    type: MaterialResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Material não encontrado',
  })
  @ApiConflictResponse({
    description: 'Nome do material já está em uso por outro material',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um material',
    description: 'Remove um material do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do material',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Material removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Material não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.remove(id);
  }
}
