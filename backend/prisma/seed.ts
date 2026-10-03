import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Cria o pool de conexões utilizando a variável de ambiente DATABASE_URL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Instancia o PrismaClient passando o adapter configurado
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o povoamento (seed) de Ordens de Serviço...');

  // 1. Garantir Grupos e Cadastros Base
  const materialGroup = await prisma.materialGroup.upsert({
    where: { group: 'Peças e Lubrificantes' },
    update: {},
    create: { group: 'Peças e Lubrificantes' },
  });

  const jobGroup = await prisma.maintenanceJobGroup.upsert({
    where: { group: 'Mecânica Geral' },
    update: {},
    create: { group: 'Mecânica Geral' },
  });

  // 2. Criar Materiais (Peças)
  const oil = await prisma.material.upsert({
    where: { name: 'Óleo 5W30 Sintético' },
    update: {},
    create: { name: 'Óleo 5W30 Sintético', group_id: materialGroup.id },
  });

  const oilFilter = await prisma.material.upsert({
    where: { name: 'Filtro de Óleo Engine' },
    update: {},
    create: { name: 'Filtro de Óleo Engine', group_id: materialGroup.id },
  });

  const brakePads = await prisma.material.upsert({
    where: { name: 'Jogo de Pastilhas de Freio' },
    update: {},
    create: { name: 'Jogo de Pastilhas de Freio', group_id: materialGroup.id },
  });

  // 3. Criar Serviços (MaintenanceJobs)
  const oilChangeJob = await prisma.maintenanceJob.upsert({
    where: { name: 'Troca de Óleo e Filtros' },
    update: {},
    create: { name: 'Troca de Óleo e Filtros', group_id: jobGroup.id },
  });

  const brakeJob = await prisma.maintenanceJob.upsert({
    where: { name: 'Manutenção do Sistema de Freios' },
    update: {},
    create: { name: 'Manutenção do Sistema de Freios', group_id: jobGroup.id },
  });

  const suspensionJob = await prisma.maintenanceJob.upsert({
    where: { name: 'Revisão da Suspensão Dianteira' },
    update: {},
    create: { name: 'Revisão da Suspensão Dianteira', group_id: jobGroup.id },
  });

  // 4. Criar Clientes e Veículos
  const customer1 = await prisma.customer.upsert({
    where: { cell: '(21) 99999-1111' },
    update: {},
    create: { name: 'Carlos Eduardo Silva', cell: '(21) 99999-1111' },
  });

  const vehicle1 = await prisma.vehicle.upsert({
    where: { license_plate: 'KLU-9821' },
    update: {},
    create: {
      license_plate: 'KLU-9821',
      brand: 'Chevrolet',
      model: 'Onix 1.0',
      year: 2021,
      color: 'Prata',
      customer_id: customer1.id,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { cell: '(21) 98888-2222' },
    update: {},
    create: { name: 'Mariana Costa', cell: '(21) 98888-2222' },
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

  // 5. Mapeamento de Datas Retroativas para Teste de Dashboard (Últimos 6 meses)
  const now = new Date();
  const getPastDate = (monthsAgo: number, day = 15) => {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - monthsAgo,
      day,
      10,
      0,
      0,
    );
    return d;
  };

  // Status: 1: Pendente | 2: Em andamento | 3: Concluído | 4: Aberta | 5: Aguardando peças | 6: Cancelada | 7: Ainda a pagar

  // OS 1: Concluída neste mês
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer1.id,
      vehicle_id: vehicle1.id,
      professional: 'Roberto Mecânico',
      status: 3, // Concluído
      paymentStatus: 2, // Pago
      entry_km: 45000,
      diagnosis: 'Revisão de rotina e barulho ao frear',
      observation: 'Cliente solicitou checagem do nível de água',
      labor_cost: 150.0,
      subtotal: 380.0,
      paid: 380.0,
      created_at: getPastDate(0, 5),
      itemMaintenances: {
        create: [
          {
            maintenance_id: oilChangeJob.id,
            description: 'Troca de óleo do motor e filtro',
          },
          {
            maintenance_id: brakeJob.id,
            description: 'Substituição das pastilhas de freio dianteiras',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: oil.id,
            quantity: 4,
            value_unit: 45.0,
          },
          {
            material_id: oilFilter.id,
            quantity: 1,
            value_unit: 50.0,
          },
        ],
      },
    },
  });

  // OS 2: Em andamento (Mês atual)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer2.id,
      vehicle_id: vehicle2.id,
      professional: 'Lucas Técnico',
      status: 2, // Em andamento
      paymentStatus: 1, // Pendente
      entry_km: 18500,
      diagnosis: 'Barulho na suspensão lado esquerdo',
      labor_cost: 250.0,
      subtotal: 600.0,
      paid: 0.0,
      created_at: getPastDate(0, 1),
      itemMaintenances: {
        create: [
          {
            maintenance_id: suspensionJob.id,
            description: 'Troca do pivô e bieleta da suspensão',
          },
        ],
      },
    },
  });

  // OS 3: Concluída - Mês Anterior (-1 mês)
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer1.id,
      vehicle_id: vehicle1.id,
      professional: 'Roberto Mecânico',
      status: 3, // Concluído
      paymentStatus: 2,
      entry_km: 41200,
      diagnosis: 'Troca de pastilhas urgente',
      labor_cost: 100.0,
      subtotal: 280.0,
      paid: 280.0,
      created_at: getPastDate(1, 12),
      itemMaintenances: {
        create: [
          {
            maintenance_id: brakeJob.id,
            description: 'Substituição de pastilhas e sangria do sistema',
          },
        ],
      },
      itemMaterials: {
        create: [
          {
            material_id: brakePads.id,
            quantity: 1,
            value_unit: 180.0,
          },
        ],
      },
    },
  });

  // OS 4: Concluída - Há 2 meses
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer2.id,
      vehicle_id: vehicle2.id,
      professional: 'Lucas Técnico',
      status: 3, // Concluído
      paymentStatus: 2,
      entry_km: 12000,
      diagnosis: 'Primeira revisão de 10.000km',
      labor_cost: 200.0,
      subtotal: 450.0,
      paid: 450.0,
      created_at: getPastDate(2, 20),
      itemMaintenances: {
        create: [
          {
            maintenance_id: oilChangeJob.id,
            description: 'Troca de óleo e filtro preventiva',
          },
        ],
      },
    },
  });

  // OS 5: Concluída - Há 3 meses
  await prisma.serviceOrder.create({
    data: {
      customer_id: customer1.id,
      vehicle_id: vehicle1.id,
      professional: 'Roberto Mecânico',
      status: 3, // Concluído
      paymentStatus: 2,
      entry_km: 35000,
      diagnosis: 'Revisão periódica',
      labor_cost: 180.0,
      subtotal: 520.0,
      paid: 520.0,
      created_at: getPastDate(3, 10),
      itemMaintenances: {
        create: [
          {
            maintenance_id: oilChangeJob.id,
            description: 'Troca de óleo e filtros',
          },
        ],
      },
    },
  });

  console.log('✅ Novas Ordens de Serviço inseridas com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar a seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
