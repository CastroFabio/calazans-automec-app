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
import { MaterialItemService } from './material-item.service';
import { CreateMaterialItemDto } from './dto/create-material-item.dto';
import { UpdateMaterialItemDto } from './dto/update-material-item.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MaterialResponseDto } from 'src/material/dto/response-material.dto';

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
  findAll() {
    return this.materialItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialItemDto: UpdateMaterialItemDto,
  ) {
    return this.materialItemService.update(+id, updateMaterialItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialItemService.remove(+id);
  }
}
