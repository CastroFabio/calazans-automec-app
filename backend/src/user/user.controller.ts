import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/response-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar um novo usuário',
    description:
      'Cria um novo usuário no sistema com validação de unicidade de e-mail',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos enviados no corpo da requisição',
    schema: {
      example: {
        statusCode: 400,
        message: ['email deve ser um e-mail válido', 'name é obrigatório'],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflito de dados (E-mail já cadastrado)',
    schema: {
      example: {
        statusCode: 409,
        message: 'Já existe um usuário com este email',
        error: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna um usuário específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Usuário não encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
}
