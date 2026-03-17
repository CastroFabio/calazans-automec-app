export const serviceOrderListDTO = [
  {
    customer: { name: "Ana Paula Ribeiro" },
    vehicle: { brand: "Honda", model: "Civic EXL", licensePlate: "ABC-1234" },
    serviceOrder: {
      id: "OS-2025-0142",
      professional: "Carlos Mendes",
      priority: "alta",
      status: "progress",
      arrived_at: "20/02/2025 09:00",
      value: "R$ 680,00",
    },
    maintenanceJob: [
      { name: "Revisão geral" },
      { name: "Troca de correia dentada" },
    ],
  },
  {
    customer: { name: "Bernardo Alves" },
    vehicle: {
      brand: "Toyota",
      model: "Corolla XEI",
      licensePlate: "DEF-5678",
    },
    serviceOrder: {
      id: "OS-2025-0141",
      professional: "Fernanda Costa",
      priority: "normal",
      status: "pending",
      arrived_at: "19/02/2025 14:00",
      value: "R$ 120,00",
    },
    maintenanceJob: [{ name: "Alinhamento e balanceamento" }],
  },
  {
    customer: { name: "Clínica VitaSaúde" },
    vehicle: {
      brand: "Hyundai",
      model: "Tucson GLS",
      licensePlate: "PQR-2468",
    },
    serviceOrder: {
      id: "OS-2025-0140",
      professional: "Ana Lima",
      priority: "urgente",
      status: "done",
      arrived_at: "13/02/2025 11:00",
      value: "R$ 1.240,00",
    },
    maintenanceJob: [
      { name: "Troca de óleo e filtros" },
      { name: "Diagnóstico eletrônico" },
      { name: "Elétrica — revisão" },
      { name: "Troca de bateria" },
    ],
  },
];
