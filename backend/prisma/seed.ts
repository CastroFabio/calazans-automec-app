import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configura o pool de conexão do PostgreSQL e o adaptador do Prisma v7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o processo de seed...');

  // 1. Limpeza do banco de dados (respeitando a ordem de exclusão)
  await prisma.itemMaterial.deleteMany();
  await prisma.itemMaintenance.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.material.deleteMany();
  await prisma.materialGroup.deleteMany();
  await prisma.maintenanceJob.deleteMany();
  await prisma.maintenanceJobGroup.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();

  console.log('🧹 Banco limpo com sucesso.');

  // 2. Hash da senha para o Usuário Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 3. Criar Clientes (Customer)
  const customer1 = await prisma.customer.create({
    data: {
      name: 'João Silva',
      cell: '21999998888',
      telephone: '2133334444',
      observation: 'Cliente preferencial de sábado',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Maria Oliveira',
      cell: '21988887777',
      observation: 'Frota da empresa',
    },
  });

  // 4. Criar Usuários (User)
  await prisma.user.create({
    data: {
      name: 'Administrador System',
      email: 'admin@calazans.com',
      password_hash: hashedPassword,
      role: Role.ADMIN,
      is_active: true,
    },
  });

  await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      password_hash: hashedPassword,
      role: Role.CUSTOMER,
      is_active: true,
      customer_id: customer1.id,
    },
  });

  // 5. Criar Veículos (Vehicle)
  const vehicle1 = await prisma.vehicle.create({
    data: {
      license_plate: 'ABC1D23',
      brand: 'Chevrolet',
      model: 'Onix',
      year: 2021,
      color: 'Prata',
      customer_id: customer1.id,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      license_plate: 'XYZ9876',
      brand: 'Volkswagen',
      model: 'Gol',
      year: 2018,
      color: 'Preto',
      customer_id: customer2.id,
    },
  });

  // 6. Grupo de Materiais e Materiais
  const matGroup = await prisma.materialGroup.create({
    data: {
      group: 'Lubrificantes e Fluidos',
    },
  });

  const material1 = await prisma.material.create({
    data: {
      name: 'Óleo Motor 5W30 Sintético',
      group_id: matGroup.id,
    },
  });

  const material2 = await prisma.material.create({
    data: {
      name: 'Filtro de Óleo',
      group_id: matGroup.id,
    },
  });

  // 7. Grupo de Serviços de Manutenção e Serviços
  const jobGroup = await prisma.maintenanceJobGroup.create({
    data: {
      group: 'Revisão Preventiva',
    },
  });

  const job1 = await prisma.maintenanceJob.create({
    data: {
      name: 'Troca de Óleo e Filtros',
      group_id: jobGroup.id,
    },
  });

  // 8. Ordem de Serviço (ServiceOrder)
  const serviceOrder1 = await prisma.serviceOrder.create({
    data: {
      customer_id: customer1.id,
      vehicle_id: vehicle1.id,
      professional: 'Carlos Mecânico',
      status: 1,
      paymentStatus: 1,
      entry_km: 45000.0,
      diagnosis: 'Barulho no motor ao ligar de manhã',
      observation: 'Cliente solicitou entrega até às 17h',
      labor_cost: 150.0,
      subtotal: 350.0,
      paid: 0.0,
    },
  });

  // 9. Itens da Ordem de Serviço
  const itemMaintenance1 = await prisma.itemMaintenance.create({
    data: {
      serviceorder_id: serviceOrder1.id,
      maintenance_id: job1.id,
      description: 'Execução da troca de óleo completa',
    },
  });

  await prisma.itemMaterial.create({
    data: {
      serviceorder_id: serviceOrder1.id,
      itemMaintenance_id: itemMaintenance1.id,
      material_id: material1.id,
      quantity: 4,
      value_unit: 45.0,
      supplier: 'Distribuidora AutoPeças',
      isCustomerSupplier: false,
    },
  });

  await prisma.itemMaterial.create({
    data: {
      serviceorder_id: serviceOrder1.id,
      itemMaintenance_id: itemMaintenance1.id,
      material_id: material2.id,
      quantity: 1,
      value_unit: 20.0,
      supplier: 'Distribuidora AutoPeças',
      isCustomerSupplier: false,
    },
  });

  console.log('✅ Seed executado com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
