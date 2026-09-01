import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('CustomersService (Unitario)', () => {
  let service: CustomersService;
  let prismaMock: {
    customer: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    // 1. Criamos os mocks para as funções do Prisma usadas pelo Service
    prismaMock = {
      customer: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
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
      // Arrange
      const customerInput = { name: 'João Silva', cell: '21999999999' };
      prismaMock.customer.findUnique.mockResolvedValue({
        id: 2,
        ...customerInput,
      }); // Já existe

      // Act & Assert
      await expect(service.create(customerInput)).rejects.toThrow(
        new ConflictException('Já existe um cliente com este celular'),
      );
      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o nome for null', async () => {
      // Arrange
      const customerInput = { name: null as any, cell: '212329994' };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O nome do cliente é obrigatório'),
      );
      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o nome for vazio', async () => {
      // Arrange
      const customerInput = { name: '', cell: '212329994' };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O nome do cliente é obrigatório'),
      );
      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o celular não for string', async () => {
      const customerInput = { name: 'João da Silva', cell: 212329999 as any };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O celular deve ser uma string'),
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o celular for vazio', async () => {
      const customerInput = { name: 'João da Silva', cell: '' };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O celular é obrigatório'),
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o celular for null', async () => {
      const customerInput = { name: 'João da Silva', cell: null as any };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O celular é obrigatório'),
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o celular for undefined', async () => {
      const customerInput = { name: 'João da Silva', cell: undefined as any };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O celular é obrigatório'),
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o telefone não for string', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: '212329999',
        telephone: 212329999 as any,
      };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('O telefone deve ser uma string'),
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se a observação não for string', async () => {
      const customerInput = {
        name: 'João da Silva',
        cell: '212329999',
        observation: 3232 as any,
      };
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.create(customerInput)).rejects.toThrow(
        new BadRequestException('A observação deve ser uma string'),
      );

      expect(prismaMock.customer.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve achar e enviar os dados do cliente com seus relacionamentos se o cliente for encontrado', async () => {
      // 1. ARRANGE
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
      const mockCustomer = { id: customerID, name: 'João da Silva' };

      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer as any);

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

    it('deve retornar BadRequestException caso o ID não seja um número', async () => {
      const invalidID = 'n' as any;
      await expect(service.findOne(invalidID)).rejects.toThrow(
        new BadRequestException('O ID deve ser um número'),
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar BadRequestException caso o ID seja null', async () => {
      const invalidID = null as any;
      await expect(service.findOne(invalidID)).rejects.toThrow(
        new BadRequestException('O ID é obrigatório'),
      );
      expect(prismaMock.customer.findUnique).not.toHaveBeenCalled();
    });

    it('deve retornar BadRequestException caso o ID seja undefined', async () => {
      const invalidID = undefined as any;
      await expect(service.findOne(invalidID)).rejects.toThrow(
        new BadRequestException('O ID é obrigatório'),
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

  describe('update', () => {
    it('deve atualizar um cliente com sucesso quando os dados forem válidos', async () => {
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: '21999999999',
        observation: null,
      };
      const customerID = 1;
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
      const expectedData = {
        name: updatedCustomer.name,
        cell: updatedCustomer.cell,
        telephone: updatedCustomer.telephone,
        observation: updatedCustomer.observation,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(customerID, customerInput as any);

      expect(result).toEqual(updatedCustomer);
      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: customerID },
        data: expectedData,
      });
    });

    it('deve atualizar um cliente com sucesso e retornar o cliente incluindo todos os relacionamentos', async () => {
      const customerID = 1;
      const customerInput = {
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
      };

      const updatedCustomerWithRelations = {
        ...existingCustomer,
        ...customerInput,
        vehicles: [],
        serviceOrders: [],
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(
        updatedCustomerWithRelations as any,
      );

      const result = await service.update(customerID, customerInput as any);

      expect(result).toEqual(updatedCustomerWithRelations);
    });

    it('deve retornar um NotFoundException se o ID não for encontrado', async () => {
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(service.update(999, customerInput as any)).rejects.toThrow(
        new NotFoundException('Cliente não encontrado'),
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o nome não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 23232 as any,
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
      };
      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      };
      const expectedData = {
        name: updatedCustomer.name,
        cell: updatedCustomer.cell,
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(
        service.update(customerID, customerInput as any),
      ).rejects.toThrow(
        new BadRequestException('O nome do cliente deve ser string'),
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o celular não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 'João Silva',
        cell: 21999999999 as any,
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
      };
      const updatedCustomer = {
        ...existingCustomer,
        ...customerInput,
      };
      const expectedData = {
        name: updatedCustomer.name,
        cell: updatedCustomer.cell,
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(
        service.update(customerID, customerInput as any),
      ).rejects.toThrow(
        new BadRequestException('O celular do cliente deve ser string'),
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o telefone não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: 213 as any,
        observation: null,
      };
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
      const expectedData = {
        name: updatedCustomer.name,
        cell: updatedCustomer.cell,
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(
        service.update(customerID, customerInput as any),
      ).rejects.toThrow(
        new BadRequestException('O telefone do cliente deve ser string'),
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se a observação não for string', async () => {
      const customerID = 1;
      const customerInput = {
        name: 'João Silva',
        cell: '21999999999',
        telephone: null,
        observation: 23232 as any,
      };
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
      const expectedData = {
        name: updatedCustomer.name,
        cell: updatedCustomer.cell,
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      await expect(
        service.update(customerID, customerInput as any),
      ).rejects.toThrow(
        new BadRequestException('A observação do cliente deve ser string'),
      );
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar ConflictException se o celular já estiver sendo usado', async () => {
      // 1. ARRANGE
      const customerID = 1;
      const customerInput = {
        cell: '21999999999', // Novo celular desejado
      };

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
      await expect(
        service.update(customerID, customerInput as any),
      ).rejects.toThrow(new ConflictException('Este celular já está em uso'));

      // Garante que a atualização no banco não foi executada
      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });

    it('deve lancar BadRequestException se o body veio vazio', async () => {
      const customerID = 1;
      const customerInput = {};
      const existingCustomer = {
        id: customerID,
        created_at: new Date(),
        name: 'João Antigo',
        cell: '21999999999',
        telephone: null,
        observation: null,
      };

      prismaMock.customer.findUnique.mockResolvedValue(existingCustomer);

      await expect(
        service.update(customerID, customerInput as any),
      ).rejects.toThrow(new BadRequestException('Nenhum corpo na requisição'));
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
      };

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
      const result = await service.update(customerID, customerInput as any);

      // 3. ASSERT
      expect(result).toEqual(updatedCustomer);
      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: customerID },
        data: expectedData,
      });
    });
  });
});
