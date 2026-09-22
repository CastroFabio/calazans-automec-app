import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CustomerHasPendingDebtsException } from './exceptions';
import { Customer, Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  InvalidNumberPropertyException,
  InvalidStringPropertyException,
  NullOrUndefinedValueException,
  RequiredBodyException,
  RequiredFieldException,
  ResourceHasDependenciesException,
  ValueMustBeGreaterThanZeroException,
} from '../common/exceptions';
import { PaginationDto } from './dto/pagination.dto';
import { CustomerResponseDto } from './dto/response-customer.dto';

describe('CustomersService (Unitario)', () => {
  let service: CustomersService;
  let prismaMock: {
    $transaction: jest.Mock;
    customer: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    // 1. Criamos os mocks para as funções do Prisma usadas pelo Service
    prismaMock = {
      $transaction: jest.fn(),
      customer: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um cliente com sucesso quando os dados forem validos', async () => {
      // Arrange
      const customerInput = { name: 'João Silva', cell: '21999999999' };
      const createdCustomer = {
        id: 1,
        created_at: new Date(),
        ...customerInput,
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(null); // Nenhum cliente com esse cell existe
      prismaMock.customer.create.mockResolvedValue(createdCustomer);

      // Act
      const result = await service.create(customerInput);

      // Assert
      expect(result).toEqual(createdCustomer);
      expect(prismaMock.customer.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar e retornar o cliente com sucesso quando os dados forem válidos', async () => {
      // 1. ARRANGE
      const customerInput = { name: 'João Silva', cell: '21999999999' };
      const createdCustomer = {
        id: 1,
        created_at: new Date(),
        ...customerInput,
        telephone: null,
        observation: null,
      };
      const expectedData = {
        name: createdCustomer.name,
        cell: createdCustomer.cell,
        telephone: null,
        observation: null,
      };

      // Simular o cenário onde nenhum cliente foi encontrado no banco de dados
      // com aquele parâmetro (por exemplo, buscando por um celular ou ID).
      prismaMock.customer.findUnique.mockResolvedValue(null);
      prismaMock.customer.create.mockResolvedValue(createdCustomer);

      // 2. ACT
      const result = await service.create(customerInput);

      // 3. ASSERT
      expect(result).toEqual(createdCustomer);
      expect(prismaMock.customer.create).toHaveBeenCalledWith({
        data: expectedData,
      });
    });

    it('deve lancar ConflictException se o celular ja estiver cadastrado', async () => {
      const customerInput = { name: 'João Silva', cell: '21999999999' };
      prismaMock.customer.findUnique.mockResolvedValue({
        id: 2,
        ...customerInput,
      });

      await expect(service.create(customerInput)).rejects.toThrow(
        new ConflictException('Já existe um cliente com este celular'),
      );
      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar NullOrUndefinedValueException se o nome for null', async () => {
      // Arrange
      const customerInput = {
        name: null,
        cell: '212329994',
      } as unknown as CreateCustomerDto;
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert

      await expect(service.create(customerInput)).rejects.toThrow(
        new NullOrUndefinedValueException('name'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "A propriedade 'name' não pode ser nula ou indefinida.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar RequiredFieldException se o nome for vazio', async () => {
      // Arrange
      const customerInput = { name: '', cell: '212329994' };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(customerInput)).rejects.toThrow(
        new RequiredFieldException('name'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "O campo 'name' é obrigatório e não foi fornecido.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se o celular não for string', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: 212329999,
      } as unknown as CreateCustomerDto;
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('cell'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "A propriedade 'cell' precisa ser uma string válida.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar RequiredFieldException se o celular for vazio', async () => {
      const customerInput = { name: 'João da Silva', cell: '' };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new RequiredFieldException('cell'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "O campo 'cell' é obrigatório e não foi fornecido.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar NullOrUndefinedValueException se o celular for null', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: null,
      } as unknown as CreateCustomerDto;
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new NullOrUndefinedValueException('cell'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "A propriedade 'cell' não pode ser nula ou indefinida.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar NullOrUndefinedValueException se o celular for undefined', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: undefined,
      } as unknown as CreateCustomerDto;
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new NullOrUndefinedValueException('cell'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "A propriedade 'cell' não pode ser nula ou indefinida.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se o telefone não for string', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: '212329999',
        telephone: 212329999,
      } as unknown as CreateCustomerDto;
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('telephone'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "A propriedade 'telephone' precisa ser uma string válida.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se a observação não for string', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: '212329999',
        observation: 3232,
      } as unknown as CreateCustomerDto;
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('observation'),
      );

      await expect(service.create(customerInput)).rejects.toThrow(
        "A propriedade 'observation' precisa ser uma string válida.",
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve achar e enviar os dados do cliente com seus relacionamentos se o cliente for encontrado', async () => {
      const customerID = 1;
      const mockCustomer = {
        id: customerID,
        name: 'João da Silva',
        cell: '212329994',
        telephone: null,
        observation: '',
        vehicles: [],
        serviceOrders: [
          {
            vehicle: {},
            itemMaintenances: [{ maintenancejob: {} }],
          },
        ],
      };

      // O mock do Prisma deve retornar exatamente a estrutura esperada
      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);

      // 2. ACT
      const result = await service.findOne(customerID);

      // 3. ASSERT
      expect(result).toEqual(mockCustomer);
      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerID },
        include: {
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });
    });

    it('deve lancar NotFoundException se o ID do cliente nao for encontrado', async () => {
      // Arrange
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('deve buscar o cliente incluindo todos os seus relacionamentos', async () => {
      // 1. ARRANGE
      const customerID = 1;
      const mockCustomer = {
        id: customerID,
        name: 'João da Silva',
        cell: '212329994',
        telephone: null,
        observation: null,
        created_at: new Date(),
      } as unknown as CreateCustomerDto;

      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);

      // 2. ACT
      await service.findOne(customerID);

      // 3. ASSERT
      // Este é o teste que vai FALHAR se você esquecer ou alterar o include no Service:
      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerID },
        include: {
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: {
                include: { maintenancejob: true },
              },
            },
          },
        },
      });
    });

    it('deve retornar InvalidNumberPropertyException caso o ID não seja um número', async () => {
      const invalidID = 'n' as unknown as number;
      await expect(service.findOne(invalidID)).rejects.toThrow(
        new InvalidNumberPropertyException('id'),
      );
      await expect(service.findOne(invalidID)).rejects.toThrow(
        "A propriedade 'id' precisa ser um number válido.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar NullOrUndefinedValueException caso o ID seja null', async () => {
      const invalidID = null as unknown as number;
      await expect(service.findOne(invalidID)).rejects.toThrow(
        new NullOrUndefinedValueException('id'),
      );
      await expect(service.findOne(invalidID)).rejects.toThrow(
        "A propriedade 'id' não pode ser nula ou indefinida.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar NullOrUndefinedValueException caso o ID seja undefined', async () => {
      const invalidID = undefined as unknown as number;
      await expect(service.findOne(invalidID)).rejects.toThrow(
        new NullOrUndefinedValueException('id'),
      );
      await expect(service.findOne(invalidID)).rejects.toThrow(
        "A propriedade 'id' não pode ser nula ou indefinida.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve buscar todos os clientes incluindo todos os seus relacionamentos', async () => {
      // 1. ARRANGE
      const mockCustomersList = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      // Ensina o mock do Prisma a retornar a lista de clientes simulada
      prismaMock.customer.findMany.mockResolvedValue(mockCustomersList);

      // 2. ACT
      const result = await service.findAll();

      // 3. ASSERT
      // Valida se o retorno do Service foi a lista esperada
      expect(result).toEqual(mockCustomersList);

      // Valida se o método findMany foi chamado com os includes exatos de relacionamentos
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });

    it('deve buscar todos os clientes incluindo todos os seus relacionamentos', async () => {
      // 1. ARRANGE
      const mockCustomersList = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      // Ensina o mock do Prisma a retornar a lista de clientes simulada
      prismaMock.customer.findMany.mockResolvedValue(mockCustomersList);

      // 2. ACT
      const result = await service.findAll();

      // 3. ASSERT
      // Valida se o retorno do Service foi a lista esperada
      expect(result).toEqual(mockCustomersList);

      // Valida se o método findMany foi chamado com os includes exatos de relacionamentos
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });
  });

  describe('findAllPerPage', () => {
    it('deve retornar uma lista paginada de clientes com sucesso', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 1;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve retornar uma lista paginada ordenada de forma decrescente pela data de criação de clientes com sucesso', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 2;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          created_at: new Date('2026-09-22T16:00:00-03:00'),
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
        {
          id: 2,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          created_at: new Date('2026-09-21T16:00:00-03:00'),
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve executar findMany e count atomicamente dentro de uma única $transaction', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 1;

      const paginationInput: PaginationDto = {
        page,
        limit,
      };

      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          created_at: new Date('2026-09-22T16:00:00-03:00'),
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      // Configura os mocks das consultas internas para retornarem Promises/Valores válidos
      prismaMock.customer.findMany.mockResolvedValue(mockCustomerRecords);
      prismaMock.customer.count.mockResolvedValue(totalItems);

      // Mock do $transaction
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      await service.findAllPerPage(paginationInput);

      // 1. Valida se o $transaction foi invocado exatamente uma vez
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 2. Valida se $transaction recebeu um Array com 2 elementos
      expect(prismaMock.$transaction).toHaveBeenCalledWith(
        expect.arrayContaining([expect.anything(), expect.anything()]),
      );

      // 3. Valida se as consultas foram acionadas
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          skip: 0,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
      );

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('deve aplicar a paginação padronizada na página 1 quando o parâmetro page for inválido', async () => {
      const page = null as unknown as number;
      const limit = 5;
      const totalItems = 1;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      const expectedPage = 1;

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: expectedPage,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve aplicar a paginação padronizada na página 1 quando o parâmetro page for menor que 1', async () => {
      const page = -1 as unknown as number;
      const limit = 5;
      const totalItems = 1;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      const expectedPage = 1;

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: expectedPage,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve aplicar a paginação padronizada no limite 5 quando o parâmetro limit for inválido', async () => {
      const page = 1;
      const limit = null as unknown as number;
      const totalItems = 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      const expectedLimit = 5;
      const expectedTotalPages = Math.ceil(totalItems / expectedLimit);

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: expectedLimit,
          totalItems,
          totalPages: expectedTotalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: expectedLimit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve aplicar a paginação padronizada no limite 5 quando o parâmetro limit for vazio', async () => {
      const page = 1;
      const limit = '' as unknown as number;
      const totalItems = 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      const expectedLimit = 5;
      const expectedTotalPages = Math.ceil(totalItems / expectedLimit);

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: expectedLimit,
          totalItems,
          totalPages: expectedTotalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: expectedLimit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve ignorar o filtro de busca quando o parâmetro search contiver apenas espaços em branco', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 1;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const searchTerm = ' ' as unknown as string;

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      const expectedWhereClause: Prisma.CustomerWhereInput = {};

      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      const result = await service.findAllPerPage(paginationInput);

      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve ignorar o filtro de busca quando o parâmetro search for vazio', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 1;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const searchTerm = '' as unknown as string;

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      const mockCustomerRecords = [
        {
          id: 1,
          name: 'João Silva',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      const expectedWhereClause: Prisma.CustomerWhereInput = {};

      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      const result = await service.findAllPerPage(paginationInput);

      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve calcular o deslocamento correto (skip) com base na página e no limite informados', async () => {
      const page = 3;
      const limit = 5;
      const totalItems = 15;
      const expectedSkip = (page - 1) * limit;

      const paginationInput: PaginationDto = {
        page,
        limit,
      };

      const mockCustomerRecords = [
        {
          id: 11,
          name: 'Cliente Página 3',
          cell: '21999999999',
          telephone: null,
          observation: null,
          vehicles: [],
          serviceOrders: [],
          _count: { serviceOrders: 0, vehicles: 0 },
        },
      ];

      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      const result = await service.findAllPerPage(paginationInput);

      expect(result.meta.currentPage).toBe(page);
      expect(result.meta.perPage).toBe(limit);

      expect(prismaMock.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: expectedSkip,
          take: limit,
        }),
      );
    });

    it('deve calcular totalPages corretamente e retornar no mínimo 1 quando totalItems for igual a 0', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 0;
      const expectedTotalPages = 1;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      // 1. Mock do Array de registros que o Prisma realmente retorna no findMany
      const mockCustomerRecords: never[] = [];

      // 2. Cláusula WHERE esperada para a busca 'João Silva'
      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      // 3. Mock do $transaction (retorna a tupla [data, totalItems])
      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      // 4. Execução do método no service
      const result = await service.findAllPerPage(paginationInput);

      // 5. Validação da estrutura de retorno da paginação
      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages: expectedTotalPages,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      // 6. Validação do $transaction com as promessas do Prisma
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      // 7. Validação das chamadas com os filtros corretos (where, skip, take, include, orderBy)
      expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: 0,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          _count: { select: { serviceOrders: true, vehicles: true } },
          vehicles: true,
          serviceOrders: {
            include: {
              vehicle: true,
              itemMaintenances: { include: { maintenancejob: true } },
            },
          },
        },
      });

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve retornar hasNextPage como true quando a página atual for menor que o total de páginas', async () => {
      const page = 1;
      const limit = 5;
      const totalItems = 20;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const expectedHasNextPage = true;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      const mockCustomerRecords = Array.from({ length: limit }, (_, index) => ({
        id: index + 1,
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: null,
        vehicles: [],
        serviceOrders: [],
        _count: { serviceOrders: 0, vehicles: 0 },
      }));

      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      const result = await service.findAllPerPage(paginationInput);

      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: expectedHasNextPage,
          hasPreviousPage: false,
        },
      });

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      expect(prismaMock.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhereClause,
          take: limit,
          skip: 0,
        }),
      );

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });

    it('deve retornar hasPreviousPage como true quando a página atual for maior que 1', async () => {
      const page = 2;
      const limit = 5;
      const totalItems = 20;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const expectedHasPreviousPage = true;
      const expectedSkip = (page - 1) * limit;

      const searchTerm = 'João Silva';

      const paginationInput: PaginationDto = {
        page,
        limit,
        search: searchTerm,
      };

      const mockCustomerRecords = Array.from({ length: limit }, (_, index) => ({
        id: index + 1,
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: null,
        vehicles: [],
        serviceOrders: [],
        _count: { serviceOrders: 0, vehicles: 0 },
      }));

      const expectedWhereClause: Prisma.CustomerWhereInput = {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { cell: { contains: searchTerm, mode: 'insensitive' } },
              {
                vehicles: {
                  some: {
                    license_plate: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      };

      prismaMock.$transaction.mockResolvedValue([
        mockCustomerRecords,
        totalItems,
      ]);

      const result = await service.findAllPerPage(paginationInput);

      expect(result).toEqual({
        data: mockCustomerRecords,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages,
          hasNextPage: true,
          hasPreviousPage: expectedHasPreviousPage,
        },
      });

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      expect(prismaMock.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhereClause,
          take: limit,
          skip: expectedSkip,
        }),
      );

      expect(prismaMock.customer.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente com sucesso quando os dados forem válidos', async () => {
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: '21999999999',
        observation: null,
      } as unknown as CreateCustomerDto;
      const customerID = 1;
      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      } as unknown as CreateCustomerDto;
      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      } as unknown as CreateCustomerDto;
      const expectedData = {
        name: updatedCustomer.name,
        cell: updatedCustomer.cell,
        telephone: updatedCustomer.telephone,
        observation: updatedCustomer.observation,
      } as unknown as CreateCustomerDto;

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(customerID, customerInput);

      expect(result).toEqual(updatedCustomer);
      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: customerID },
        data: expectedData,
      });
    });

    it('deve atualizar um cliente com sucesso e retornar o cliente incluindo todos os relacionamentos', async () => {
      const customerID = 1;
      const customerInput: UpdateCustomerDto = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      } as unknown as Customer;

      const updatedCustomerWithRelations = {
        ...existingCustomer,
        ...customerInput,
        vehicles: [],
        serviceOrders: [],
      } as unknown as Customer;

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(
        updatedCustomerWithRelations,
      );

      const result = await service.update(customerID, customerInput);

      expect(result).toEqual(updatedCustomerWithRelations);
    });

    it('deve permitir atualizar mantendo o mesmo número de celular sem lancar ConflictException', async () => {
      const customerID = 1;
      const existingCustomer = {
        id: customerID,
        name: 'João',
        cell: '21999999999',
        telephone: null,
        observation: null,
      } as unknown as Customer;

      prismaMock.customer.findUnique.mockResolvedValueOnce(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(existingCustomer);

      // Enviando o mesmo celular sanitizado
      await service.update(customerID, { cell: '21999999999' });

      // findUnique deve ter sido chamado Apenas 1 vez (para checar a existência do cliente)
      expect(prismaMock.customer.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.customer.update).toHaveBeenCalled();
    });

    it('deve retornar um NotFoundException se o ID não for encontrado', async () => {
      const customerInput: UpdateCustomerDto = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.update(999, customerInput)).rejects.toThrow(
        new NotFoundException('Cliente não encontrado'),
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se o nome não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 23232,
        cell: '21999999999',
        telephone: null,
        observation: null,
      } as unknown as UpdateCustomerDto;
      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };
      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('name'),
      );
      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        "A propriedade 'name' precisa ser uma string válida.",
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se o celular não for string', async () => {
      const customerID = 1;

      const customerInput = {
        name: 'João Silva',
        cell: 21999999999,
        telephone: null,
        observation: null,
      } as unknown as UpdateCustomerDto;

      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('cell'),
      );
      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        "A propriedade 'cell' precisa ser uma string válida.",
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se o telefone não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: 213,
        observation: null,
      } as unknown as UpdateCustomerDto;
      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };
      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('telephone'),
      );
      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        "A propriedade 'telephone' precisa ser uma string válida.",
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar InvalidStringPropertyException se a observação não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: 23232,
      } as unknown as UpdateCustomerDto;
      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };
      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        new InvalidStringPropertyException('observation'),
      );
      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        "A propriedade 'observation' precisa ser uma string válida.",
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar ConflictException se o celular já estiver sendo usado', async () => {
      // 1. ARRANGE
      const customerID = 1;
      const customerInput = {
        cell: '21999999999', // Novo celular desejado
      } as unknown as UpdateCustomerDto;

      const existingCustomer = {
        id: customerID,
        name: 'João Silva',
        cell: '21888888888', // Celular atual diferente do novo
        telephone: null,
        observation: null,
        created_at: new Date(),
      };

      const anotherCustomerWithSameCell = {
        id: 2, // Outro cliente com o mesmo celular
        name: 'Maria Souza',
        cell: '21999999999',
        telephone: null,
        observation: null,
        created_at: new Date(),
      };

      // Simula primeiro a busca do cliente atual (por ID)
      // E na sequencia a busca pelo novo celular
      prismaMock.customer.findUnique
        .mockResolvedValueOnce(existingCustomer) // 1ª chamada: busca por id
        .mockResolvedValueOnce(anotherCustomerWithSameCell); // 2ª chamada: busca por cell

      // 2. ACT & ASSERT
      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        new ConflictException('Este celular já está em uso'),
      );

      // Garante que a atualização no banco não foi executada
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar RequiredBodyException se o body veio vazio', async () => {
      const customerID = 1;
      const customerInput = {} as unknown as UpdateCustomerDto;
      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);

      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        new RequiredBodyException(),
      );

      await expect(service.update(customerID, customerInput)).rejects.toThrow(
        'O corpo da requisição é obrigatório e não foi fornecido.',
      );

      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve sanitizar o celular de um cliente com sucesso', async () => {
      // 1. ARRANGE
      const customerID = 1;
      const customerInput = {
        name: 'João Silva',
        cell: '(21)99999-9998',
        telephone: '(21)88888-8888',
        observation: null,
      } as unknown as UpdateCustomerDto;

      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      // O Prisma retornará o registro já atualizado com os dados limpos
      const updatedCustomer = {
        ...existingCustomer,
        name: 'João Silva',
        cell: '21999999998',
        telephone: '21888888888',
        observation: null,
      };

      // O que esperamos que seja passado para o prisma.customer.update
      const expectedData = {
        name: 'João Silva',
        cell: '21999999998',
        telephone: '21888888888',
        observation: null,
      };

      prismaMock.customer.findUnique
        .mockResolvedValueOnce(existingCustomer)
        .mockResolvedValueOnce(null);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      // 2. ACT
      const result = await service.update(customerID, customerInput);

      // 3. ASSERT
      expect(result).toEqual(updatedCustomer);
      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: customerID },
        data: expectedData,
      });
    });

    it('deve retornar InvalidNumberPropertyException caso o ID não seja um número', async () => {
      const invalidID = 'n' as unknown as number;
      const customerInput = {
        name: 'João Silva',
        cell: '(21)99999-9998',
        telephone: '(21)88888-8888',
        observation: null,
      } as unknown as UpdateCustomerDto;

      await expect(service.update(invalidID, customerInput)).rejects.toThrow(
        new InvalidNumberPropertyException('id'),
      );
      await expect(service.update(invalidID, customerInput)).rejects.toThrow(
        "A propriedade 'id' precisa ser um number válido.",
      );

      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar NullOrUndefinedValueException caso o ID seja null', async () => {
      const invalidID = null as unknown as number;
      const customerInput = {
        name: 'João Silva',
        cell: '(21)99999-9998',
        telephone: '(21)88888-8888',
        observation: null,
      } as unknown as UpdateCustomerDto;

      await expect(service.update(invalidID, customerInput)).rejects.toThrow(
        new NullOrUndefinedValueException('id'),
      );
      await expect(service.update(invalidID, customerInput)).rejects.toThrow(
        "A propriedade 'id' não pode ser nula ou indefinida.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar NullOrUndefinedValueException caso o ID seja undefined', async () => {
      const invalidID = undefined as unknown as number;
      const customerInput = {
        name: 'João Silva',
        cell: '(21)99999-9998',
        telephone: '(21)88888-8888',
        observation: null,
      } as unknown as UpdateCustomerDto;
      await expect(service.update(invalidID, customerInput)).rejects.toThrow(
        new NullOrUndefinedValueException('id'),
      );
      await expect(service.update(invalidID, customerInput)).rejects.toThrow(
        "A propriedade 'id' não pode ser nula ou indefinida.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve lancar InternalServerErrorException ao ocorrer erro inesperado no banco', async () => {
      const customerInput = {
        name: 'João Silva',
        cell: '(21)99999-9998',
        telephone: '(21)88888-8888',
        observation: null,
      } as unknown as UpdateCustomerDto;
      prismaMock.customer.findUnique.mockRejectedValue(
        new Error('Database offline'),
      );

      await expect(service.update(1, customerInput)).rejects.toThrow(
        new InternalServerErrorException('Erro ao atualizar cliente'),
      );
    });
  });

  describe('delete', () => {
    it('deve remover um cliente com sucesso', async () => {
      const customerID = 1;
      const mockCustomer: Customer & { vehicles: any[]; serviceOrders: any[] } =
        {
          id: customerID,
          name: 'João da Silva',
          cell: '212329994',
          telephone: null,
          observation: '',
          created_at: new Date(),
          vehicles: [],
          serviceOrders: [],
        };

      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaMock.customer.delete.mockResolvedValue(mockCustomer);

      const result = await service.remove(customerID);

      expect(result).toBeUndefined();
      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerID },
        include: { vehicles: true, serviceOrders: true },
      });
      expect(prismaMock.customer.delete).toHaveBeenCalledWith({
        where: { id: customerID },
      });
      expect(prismaMock.customer.delete).toHaveBeenCalledTimes(1);
    });

    it('deve lancar NotFoundException se o ID do cliente nao for encontrado', async () => {
      // Arrange
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Cliente não encontrado'),
      );
      expect(prismaMock.customer.delete).not.toHaveBeenCalled();
    });

    it('deve retornar InvalidNumberPropertyException caso o ID não seja um número', async () => {
      const invalidID = 'n' as unknown as number;
      await expect(service.remove(invalidID)).rejects.toThrow(
        new InvalidNumberPropertyException('id'),
      );
      await expect(service.remove(invalidID)).rejects.toThrow(
        "A propriedade 'id' precisa ser um number válido.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar ValueMustBeGreaterThanZeroException caso o ID seja menor do que zero', async () => {
      const invalidID = -1;
      await expect(service.remove(invalidID)).rejects.toThrow(
        new ValueMustBeGreaterThanZeroException('id'),
      );
      await expect(service.remove(invalidID)).rejects.toThrow(
        "O campo 'id' deve ser um valor maior que zero.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar ValueMustBeGreaterThanZeroException caso o ID seja igual a zero', async () => {
      const invalidID = 0;
      await expect(service.remove(invalidID)).rejects.toThrow(
        new ValueMustBeGreaterThanZeroException('id'),
      );
      await expect(service.remove(invalidID)).rejects.toThrow(
        "O campo 'id' deve ser um valor maior que zero.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar NullOrUndefinedValueException caso o ID seja null', async () => {
      const invalidID = null as unknown as number;
      await expect(service.remove(invalidID)).rejects.toThrow(
        new NullOrUndefinedValueException('id'),
      );
      await expect(service.remove(invalidID)).rejects.toThrow(
        "A propriedade 'id' não pode ser nula ou indefinida.",
      );

      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar NullOrUndefinedValueException caso o ID seja undefined', async () => {
      const invalidID = undefined as unknown as number;
      await expect(service.remove(invalidID)).rejects.toThrow(
        new NullOrUndefinedValueException('id'),
      );
      await expect(service.remove(invalidID)).rejects.toThrow(
        "A propriedade 'id' não pode ser nula ou indefinida.",
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar ResourceHasDependenciesException caso o cliente esteja vinculado a um veículo', async () => {
      const customerID = 1;

      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
        vehicles: [
          {
            license_plate: 'ABC1D23',
            brand: 'Fiat',
            model: 'Uno',
            year: '2010',
            color: 'Prata',
          },
        ],
        serviceOrders: [],
      } as unknown as Customer;

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);

      await expect(service.remove(customerID)).rejects.toThrow(
        new ResourceHasDependenciesException('cliente', 'veículos'),
      );
      await expect(service.remove(customerID)).rejects.toThrow(
        'Não é possível excluir o(a) cliente pois existem veículos vinculados(as).',
      );

      expect(prismaMock.customer.delete).not.toHaveBeenCalled();
    });

    it('deve retornar ResourceHasDependenciesException caso o cliente esteja vinculado a uma ordem de serviço', async () => {
      const customerID = 1;

      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
        vehicles: [],
        serviceOrders: [
          {
            professional: 'a',
            priority: 'a',
            status: 'a',
            arrived_at: 'a',
            customer_id: 'a',
            vehicle_id: 'a',
            entry_km: 'a',
            diagnosis: 'a',
            observation: 'a',
          },
        ],
      } as unknown as Customer;

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);

      await expect(service.remove(customerID)).rejects.toThrow(
        new ResourceHasDependenciesException('cliente', 'ordens de serviço'),
      );
      await expect(service.remove(customerID)).rejects.toThrow(
        'Não é possível excluir o(a) cliente pois existem ordens de serviço vinculados(as).',
      );

      expect(prismaMock.customer.delete).not.toHaveBeenCalled();
    });

    it('deve retornar CustomerHasPendingDebtsException caso o cliente esteja vinculado a uma ordem de serviço em débito', async () => {
      const customerID = 1;

      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
        vehicles: [],
        serviceOrders: [
          {
            professional: 'a',
            priority: 'a',
            status: 'a',
            arrived_at: 'a',
            customer_id: 'a',
            vehicle_id: 'a',
            entry_km: 'a',
            diagnosis: 'a',
            observation: 'a',
            labor_cost: 2.55,
            subtotal: 2.55,
            paid: 1.55,
          },
        ],
      } as unknown as Customer;

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);

      await expect(service.remove(customerID)).rejects.toThrow(
        new CustomerHasPendingDebtsException(),
      );
      await expect(service.remove(customerID)).rejects.toThrow(
        'Cliente ainda possui ordens de serviço pendentes de pagamento',
      );

      expect(prismaMock.customer.delete).not.toHaveBeenCalled();
    });

    it('deve lancar InternalServerErrorException ao ocorrer erro inesperado no banco', async () => {
      prismaMock.customer.findUnique.mockRejectedValue(
        new Error('Database offline'),
      );

      await expect(service.remove(1)).rejects.toThrow(
        new InternalServerErrorException('Erro ao remover cliente'),
      );
    });
  });
});
