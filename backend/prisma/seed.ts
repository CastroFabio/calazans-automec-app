import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Cria o pool de conexões utilizando a variável de ambiente DATABASE_URL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Mapeamento de Status
const STATUS = {
  PENDING: 1, // Pendente
  IN_PROGRESS: 2, // Em andamento
  COMPLETED: 3, // Concluído
  OPEN: 4, // Aberta
  WAITING_PARTS: 5, // Aguardando peças
  CANCELED: 6, // Cancelada
};

const PAYMENT_STATUS = {
  AWAITING: 1, // Aguardando Pagamento
  PARTIALLY_PAID: 2, // Pago Parcialmente
  FULLY_PAID: 3, // Pago Integralmente
};

// Instancia o PrismaClient passando o adapter configurado
const prisma = new PrismaClient({ adapter });

async function main() {
  // Helper para gerar datas dos últimos 6 meses
  const now = new Date();
  const getPastMonthDate = (monthsAgo: number, day = 10) => {
    return new Date(
      now.getFullYear(),
      now.getMonth() - monthsAgo,
      day,
      14,
      0,
      0,
    );
  };

  const defaultPasswordHash = await bcrypt.hash('123456', 10);

  const customer1 = await prisma.customer.upsert({
    where: { cell: '21998765432' },
    update: {},
    create: {
      name: 'Carlos Eduardo da Silva',
      cell: '21998765432',
      telephone: '2126201234',
      observation: 'Cliente antigo, prefere atendimento pela manhã.',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { cell: '21987654321' },
    update: {},
    create: {
      name: 'Mariana Costa - Transportes',
      cell: '21987654321',
      telephone: null,
      observation: 'Faturamento quinzenal para empresa.',
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { cell: '21976543210' },
    update: {},
    create: {
      name: 'Fernando Henrique Souza',
      cell: '21976543210',
      telephone: null,
      observation: null,
    },
  });

  const customer4 = await prisma.customer.upsert({
    where: { cell: '21965432109' },
    update: {},
    create: {
      name: 'Patricia Lima Azevedo',
      cell: '21965432109',
      telephone: '2137019988',
      observation: 'Cliente VIP - Aplicar 5% de desconto em mão de obra.',
    },
  });

  const customer5 = await prisma.customer.upsert({
    where: { cell: '21954321098' },
    update: {},
    create: {
      name: 'Roberto Mendes Ribeiro',
      cell: '21954321098',
      telephone: null,
      observation: 'Entrar em contato apenas por WhatsApp.',
    },
  });

  console.log('🌱 Cadastrando Veículos...');

  const vehicle1 = await prisma.vehicle.upsert({
    where: { license_plate: 'KLU-9821' },
    update: {},
    create: {
      license_plate: 'KLU-9821',
      brand: 'Chevrolet',
      model: 'Onix 1.0 Turbo',
      year: 2021,
      color: 'Prata',
      customer_id: customer1.id,
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { license_plate: 'RJA-4E12' },
    update: {},
    create: {
      license_plate: 'RJA-4E12',
      brand: 'Volkswagen',
      model: 'Polo Highline',
      year: 2023,
      color: 'Preto',
      customer_id: customer2.id,
    },
  });

  const vehicle3 = await prisma.vehicle.upsert({
    where: { license_plate: 'FIO-9011' },
    update: {},
    create: {
      license_plate: 'FIO-9011',
      brand: 'Fiat',
      model: 'Fiorino 1.4 EVO',
      year: 2020,
      color: 'Branco',
      customer_id: customer2.id,
    },
  });

  const vehicle4 = await prisma.vehicle.upsert({
    where: { license_plate: 'KXB-3310' },
    update: {},
    create: {
      license_plate: 'KXB-3310',
      brand: 'Jeep',
      model: 'Renegade Longitude',
      year: 2022,
      color: 'Cinza',
      customer_id: customer3.id,
    },
  });

  const vehicle5 = await prisma.vehicle.upsert({
    where: { license_plate: 'RIO-2A99' },
    update: {},
    create: {
      license_plate: 'RIO-2A99',
      brand: 'Honda',
      model: 'Civic EXL 2.0',
      year: 2021,
      color: 'Azul',
      customer_id: customer4.id,
    },
  });

  const vehicle6 = await prisma.vehicle.upsert({
    where: { license_plate: 'LKV-1045' },
    update: {},
    create: {
      license_plate: 'LKV-1045',
      brand: 'Fiat',
      model: 'Palio Fire 1.0',
      year: 2014,
      color: 'Vermelho',
      customer_id: customer5.id,
    },
  });

  const matGroupLubrificantes = await prisma.materialGroup.upsert({
    where: { group: 'Lubrificantes e Fluidos' },
    update: {},
    create: { group: 'Lubrificantes e Fluidos' },
  });

  const matGroupFreios = await prisma.materialGroup.upsert({
    where: { group: 'Sistema de Freio' },
    update: {},
    create: { group: 'Sistema de Freio' },
  });

  const matGroupFiltros = await prisma.materialGroup.upsert({
    where: { group: 'Filtros' },
    update: {},
    create: { group: 'Filtros' },
  });

  const matGroupSuspencao = await prisma.materialGroup.upsert({
    where: { group: 'Suspensão e Direção' },
    update: {},
    create: { group: 'Suspensão e Direção' },
  });

  // 2. Materiais
  const matOleo5w30 = await prisma.material.upsert({
    where: { name: 'Óleo 5W30 Sintético (1L)' },
    update: {},
    create: {
      name: 'Óleo 5W30 Sintético (1L)',
      group_id: matGroupLubrificantes.id,
    },
  });

  const matFiltroOleo = await prisma.material.upsert({
    where: { name: 'Filtro de Óleo do Motor' },
    update: {},
    create: { name: 'Filtro de Óleo do Motor', group_id: matGroupFiltros.id },
  });

  const matFiltroAr = await prisma.material.upsert({
    where: { name: 'Filtro de Ar do Motor' },
    update: {},
    create: { name: 'Filtro de Ar do Motor', group_id: matGroupFiltros.id },
  });

  const matPastilhaFreio = await prisma.material.upsert({
    where: { name: 'Jogo de Pastilhas de Freio Dianteiras' },
    update: {},
    create: {
      name: 'Jogo de Pastilhas de Freio Dianteiras',
      group_id: matGroupFreios.id,
    },
  });

  const matFluidoFreio = await prisma.material.upsert({
    where: { name: 'Fluido de Freio DOT 4 (500ml)' },
    update: {},
    create: {
      name: 'Fluido de Freio DOT 4 (500ml)',
      group_id: matGroupFreios.id,
    },
  });

  const matAmortecedor = await prisma.material.upsert({
    where: { name: 'Par de Amortecedores Dianteiros' },
    update: {},
    create: {
      name: 'Par de Amortecedores Dianteiros',
      group_id: matGroupSuspencao.id,
    },
  });

  console.log('🌱 Cadastrando Grupos de Serviços e Serviços...');

  // 3. Grupos de Serviços / Manutenções
  const jobGroupMecanica = await prisma.maintenanceJobGroup.upsert({
    where: { group: 'Mecânica Geral' },
    update: {},
    create: { group: 'Mecânica Geral' },
  });

  const jobGroupFreios = await prisma.maintenanceJobGroup.upsert({
    where: { group: 'Freios e Segurança' },
    update: {},
    create: { group: 'Freios e Segurança' },
  });

  const jobGroupSuspencao = await prisma.maintenanceJobGroup.upsert({
    where: { group: 'Suspensão e Alinhamento' },
    update: {},
    create: { group: 'Suspensão e Alinhamento' },
  });

  // 4. Serviços (MaintenanceJobs)
  const jobTrocaOleo = await prisma.maintenanceJob.upsert({
    where: { name: 'Troca de Óleo e Filtros' },
    update: {},
    create: { name: 'Troca de Óleo e Filtros', group_id: jobGroupMecanica.id },
  });

  const jobManutencaoFreio = await prisma.maintenanceJob.upsert({
    where: { name: 'Manutenção do Sistema de Freios' },
    update: {},
    create: {
      name: 'Manutenção do Sistema de Freios',
      group_id: jobGroupFreios.id,
    },
  });

  const jobRevisaoSuspencao = await prisma.maintenanceJob.upsert({
    where: { name: 'Revisão e Troca de Suspensão Dianteira' },
    update: {},
    create: {
      name: 'Revisão e Troca de Suspensão Dianteira',
      group_id: jobGroupSuspencao.id,
    },
  });

  const jobDiagnosticoInjecao = await prisma.maintenanceJob.upsert({
    where: { name: 'Diagnóstico Eletrônico e Injeção' },
    update: {},
    create: {
      name: 'Diagnóstico Eletrônico e Injeção',
      group_id: jobGroupMecanica.id,
    },
  });

  await prisma.serviceOrder.create({
    data: {
      customer_id: customer1.id,
      vehicle_id: vehicle1.id,
      professional: 'Roberto Mecânico',
      status: STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.FULLY_PAID,
      entry_km: 42000,
      diagnosis: 'Troca de óleo de rotina',
      labor_cost: 150.0,
      subtotal: 380.0,
      paid: 380.0,
      created_at: getPastMonthDate(5, 12),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobTrocaOleo.id,
            description: 'Troca de óleo do motor e filtro',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matOleo5w30.id,
            quantity: 4,
            value_unit: 45.0,
            supplier: 'Distribuidora AutoLub',
          },
          {
            material_id: matFiltroOleo.id,
            quantity: 1,
            value_unit: 50.0,
            supplier: 'Distribuidora AutoLub',
          },
        ],
      },
    },
  });

  // 2. OS Pago Integralmente (Mês 4 - Há 4 meses)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer2.id,
      vehicle_id: vehicle2.id,
      professional: 'Lucas Técnico',
      status: STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.FULLY_PAID,
      entry_km: 28000,
      diagnosis: 'Revisão do sistema de freios',
      labor_cost: 200.0,
      subtotal: 420.0,
      paid: 420.0,
      created_at: getPastMonthDate(4, 18),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobManutencaoFreio.id,
            description: 'Substituição das pastilhas e troca de fluido',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matPastilhaFreio.id,
            quantity: 1,
            value_unit: 180.0,
            supplier: 'Freios RIO',
          },
          {
            material_id: matFluidoFreio.id,
            quantity: 1,
            value_unit: 40.0,
            supplier: 'Freios RIO',
          },
        ],
      },
    },
  });

  // 3. OS Pago Integralmente (Mês 3 - Há 3 meses)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer3.id,
      vehicle_id: vehicle4.id,
      professional: 'Roberto Mecânico',
      status: STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.FULLY_PAID,
      entry_km: 15000,
      diagnosis: 'Troca de amortecedores dianteiros',
      labor_cost: 300.0,
      subtotal: 1100.0,
      paid: 1100.0,
      created_at: getPastMonthDate(3, 8),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobRevisaoSuspencao.id,
            description: 'Troca do par de amortecedores dianteiros',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matAmortecedor.id,
            quantity: 1,
            value_unit: 800.0,
            supplier: 'Auto Peças Niterói',
          },
        ],
      },
    },
  });

  // 4. OS Pago Integralmente (Mês 2 - Há 2 meses)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer4.id,
      vehicle_id: vehicle5.id,
      professional: 'Lucas Técnico',
      status: STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.FULLY_PAID,
      entry_km: 33000,
      diagnosis: 'Luz da injeção acesa no painel',
      labor_cost: 250.0,
      subtotal: 340.0,
      paid: 340.0,
      created_at: getPastMonthDate(2, 22),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobDiagnosticoInjecao.id,
            description: 'Passagem do scanner e limpeza dos bicos',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matFiltroAr.id,
            quantity: 1,
            value_unit: 90.0,
            supplier: 'Honda Peças',
          },
        ],
      },
    },
  });

  // 5. OS Pago Integralmente (Mês 1 - Há 1 mês)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer5.id,
      vehicle_id: vehicle6.id,
      professional: 'Roberto Mecânico',
      status: STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.FULLY_PAID,
      entry_km: 112000,
      diagnosis: 'Revisão geral de fluidos e filtros',
      labor_cost: 180.0,
      subtotal: 460.0,
      paid: 460.0,
      created_at: getPastMonthDate(1, 15),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobTrocaOleo.id,
            description: 'Troca de óleo, filtro de óleo e filtro de ar',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matOleo5w30.id,
            quantity: 4,
            value_unit: 45.0,
          },
          {
            material_id: matFiltroOleo.id,
            quantity: 1,
            value_unit: 40.0,
          },
          {
            material_id: matFiltroAr.id,
            quantity: 1,
            value_unit: 60.0,
          },
        ],
      },
    },
  });

  // 6. OS Pago Integralmente (Mês Atual - 0 meses)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer1.id,
      vehicle_id: vehicle1.id,
      professional: 'Lucas Técnico',
      status: STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.FULLY_PAID,
      entry_km: 45000,
      diagnosis: 'Revisão periódica',
      labor_cost: 150.0,
      subtotal: 370.0,
      paid: 370.0,
      created_at: getPastMonthDate(0, 5),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobTrocaOleo.id,
            description: 'Troca do óleo do motor e filtro',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matOleo5w30.id,
            quantity: 4,
            value_unit: 45.0,
          },
          {
            material_id: matFiltroOleo.id,
            quantity: 1,
            value_unit: 40.0,
          },
        ],
      },
    },
  });

  // 7. OS Adicional: Em andamento / Pendente no mês atual (Para testar OSs abertas e a receber)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer2.id,
      vehicle_id: vehicle3.id,
      professional: 'Roberto Mecânico',
      status: STATUS.IN_PROGRESS,
      paymentStatus: PAYMENT_STATUS.AWAITING,
      entry_km: 55000,
      diagnosis: 'Barulho forte na roda dianteira esquerda',
      labor_cost: 200.0,
      subtotal: 580.0,
      paid: 0.0,
      created_at: getPastMonthDate(0, 2),
      itemMaintenances: {
        create: [
          {
            maintenance_id: jobManutencaoFreio.id,
            description: 'Substituição das pastilhas e verificação do disco',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: matPastilhaFreio.id,
            quantity: 1,
            value_unit: 180.0,
          },
        ],
      },
    },
  });

  const adminUser1 = await prisma.user.upsert({
    where: { email: 'admin@calazans.com' },
    update: {},
    create: {
      name: 'Administrador Principal',
      email: 'admin@calazans.com',
      password_hash: defaultPasswordHash,
      role: 'ADMIN',
      is_active: true,
    },
  });

  const adminUser2 = await prisma.user.upsert({
    where: { email: 'roberto@calazans.com' },
    update: {},
    create: {
      name: 'Roberto Mecânico',
      email: 'roberto@calazans.com',
      password_hash: defaultPasswordHash,
      role: 'ADMIN',
      is_active: true,
    },
  });

  // 2. Usuário Cliente (Vinculado ao Customer Carlos Eduardo)
  const customerUser = await prisma.user.upsert({
    where: { email: 'carlos.silva@email.com' },
    update: {},
    create: {
      name: 'Carlos Eduardo da Silva',
      email: 'carlos.silva@email.com',
      password_hash: defaultPasswordHash,
      role: 'CUSTOMER',
      is_active: true,
      customer_id: customer1.id,
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar a seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
