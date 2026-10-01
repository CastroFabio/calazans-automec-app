// src/customers/customers.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Query,
  UseGuards,
  Inject,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/response-customer.dto';
import { PaginatedCustomerResponseDto } from './dto/paginated-customer-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo cliente',
    description:
      'Cria um novo cliente no sistema com validação de unicidade do celular',
  })
  @ApiCreatedResponse({
    description: 'Cliente criado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Nome é obrigatório',
          'Celular deve ter entre 10 e 15 caracteres',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Celular já cadastrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'Já existe um cliente com este celular',
        error: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    this.logger.log(
      `[HTTP POST /customers] Request recebida`,
      CustomersController.name,
    );

    try {
      return await this.customersService.create(createCustomerDto);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP POST /customers] Falha ao processar requisição`,
        stack,
        CustomersController.name,
      );
      throw error;
    }
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar clientes',
    description: 'Retorna a quantidade total de clientes cadastrados',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  count() {
    return this.customersService.countAll();
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os clientes',
    description: 'Retorna uma lista com todos os clientes cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de clientes retornada com sucesso',
    type: [CustomerResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<CustomerResponseDto[]> {
    this.logger.log(
      `[HTTP GET /customers] Request recebida`,
      CustomersController.name,
    );

    try {
      return await this.customersService.findAll();
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP GET /customers] Falha ao processar requisição`,
        stack,
        CustomersController.name,
      );
      throw error;
    }
  }

  @Get('page')
  @ApiOperation({
    summary: 'Listar todos os clientes paginados',
    description:
      'Retorna uma lista paginada com os clientes cadastradas e metadados de paginação',
  })
  @ApiOkResponse({
    description: 'Lista paginada de clientes retornada com sucesso',
    type: PaginatedCustomerResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPerPage(@Query() paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const search = paginationDto.search?.trim() || '';
    const limit = Number(paginationDto.limit) || 5;

    this.logger.log(
      `[HTTP GET /customers/page] Request recebida - Query: ${JSON.stringify(paginationDto)}`,
      CustomersController.name,
    );

    try {
      return await this.customersService.findAllPerPage({
        page,
        limit,
        search,
      });
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP GET /customers/page] Falha ao processar requisição`,
        stack,
        CustomersController.name,
      );
      throw error;
    }
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar cliente por celular',
    description: 'Retorna um cliente específico baseado no número de celular',
  })
  @ApiQuery({
    name: 'cell',
    description: 'Número de celular do cliente (apenas números)',
    example: '11999999999',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Cliente encontrado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cliente não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cliente não encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Celular não informado',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findByCell(@Query('cell') cell: string): Promise<CustomerResponseDto | null> {
    return this.customersService.findByCell(cell);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar cliente por ID',
    description: 'Retorna um cliente específico baseado no ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Cliente encontrado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cliente não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cliente não encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerResponseDto | null> {
    this.logger.log(
      `[HTTP GET /customers/:id] Request recebida - ID: ${id}`,
      CustomersController.name,
    );

    try {
      const result = await this.customersService.findOne(id);

      return result;
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP GET /customers/:id] Falha ao processar requisição`,
        stack,
        CustomersController.name,
      );

      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um cliente',
    description: 'Atualiza os dados de um cliente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Dados do cliente a serem atualizados',
    type: UpdateCustomerDto,
  })
  @ApiOkResponse({
    description: 'Cliente atualizado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Cliente não encontrado',
  })
  @ApiConflictResponse({
    description: 'Celular já está em uso por outro cliente',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    this.logger.log(
      `[HTTP PATCH /customers/:id] Request recebida - ID: ${id}`,
      CustomersController.name,
    );
    try {
      return await this.customersService.update(id, updateCustomerDto);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP PATCH /customers/:id] Falha ao processar requisição`,
        stack,
        CustomersController.name,
      );
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um cliente',
    description:
      'Remove um cliente do sistema (não pode ter veículos vinculados)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: 1,
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Cliente removido com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Cliente não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Cliente possui veículos vinculados',
    schema: {
      example: {
        statusCode: 400,
        message: 'Não é possível excluir um cliente que possui veículos',
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(
      `[HTTP DELETE /customers/:id] Request recebida - ID: ${id}`,
      CustomersController.name,
    );

    try {
      await this.customersService.remove(id);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `[HTTP DELETE /customers/:id] Falha ao processar requisição`,
        stack,
        CustomersController.name,
      );
      throw error;
    }
  }
}
