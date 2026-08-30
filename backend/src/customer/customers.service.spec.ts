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
  let prismaMock: { customer: { create: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    // 1. Criamos os mocks para as funções do Prisma usadas pelo Service
    prismaMock = {
      customer: {
        create: jest.fn(),
        findUnique: jest.fn(),
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

    it('deve lancar NotFoundException se o cliente nao for encontrado', async () => {
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
});
