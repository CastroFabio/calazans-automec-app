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

export const customerListDTO = [
  {
    customer: {
      name: "Ana Paula Ribeiro",
      cell: "(11) 0000-0000",
      telephone: "(11) 98765-4321",
      observation: "",
    },
    vehicle: [{ licensePlate: "ABC-1234", brand: "Honda", model: "Civic EXL" }],
    numberOfVehicles: 1,
    numberOfOS: 2,
  },
  {
    customer: {
      name: "Bernardo Alves",
      cell: "(11) 0001-1111",
      telephone: "(11) 97654-3210",
      observation: "Cliente VIP",
    },
    vehicle: [
      { licensePlate: "DEF-5678", brand: "Toyota", model: "Corolla XEI" },
      { licensePlate: "GHI-9012", brand: "Fiat", model: "Toro Freedom" },
    ],
    numberOfVehicles: 2,
    numberOfOS: 2,
  },
  {
    customer: {
      name: "Carlos Fonseca",
      cell: "(11) 0002-2222",
      telephone: "(11) 96543-2109",
      observation: "Cliente VIP",
    },
    vehicle: [
      { licensePlate: "JKL-3456", brand: "Volkswagen", model: "T-Cross" },
    ],
    numberOfVehicles: 1,
    numberOfOS: 1,
  },
  {
    customer: {
      name: "Marcos Vieira",
      cell: "(11) 0003-3333",
      telephone: "(11) 95432-1098",
      observation: "Paga na entrega",
    },
    vehicle: [
      { licensePlate: "MNO-7890", brand: "Chevrolet", model: "Onix Plus" },
    ],
    numberOfVehicles: 1,
    numberOfOS: 1,
  },
  {
    customer: {
      name: "Clínica VitaSaúde",
      cell: "(11) 2345-6789",
      telephone: "(11) 99876-5432",
      observation: "Empresa — emitir NF",
    },
    vehicle: [
      { licensePlate: "PQR-2468", brand: "Hyundai", model: "Tucson GLS" },
      { licensePlate: "STU-1357", brand: "Renault", model: "Master Minibus" },
    ],
    numberOfVehicles: 2,
    numberOfOS: 2,
  },
];
