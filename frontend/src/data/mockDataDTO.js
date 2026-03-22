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

export const maintenanceJobsListDTO = [
  {
    group: "Revisão & Manutenção",
    items: [
      "Revisão geral preventiva",
      "Revisão dos 10.000 km",
      "Revisão dos 20.000 km",
      "Revisão dos 30.000 km",
      "Revisão dos 40.000 km",
      "Revisão dos 50.000 km",
    ],
  },
  {
    group: "Óleo & Filtros",
    items: [
      "Troca de óleo do motor",
      "Troca do filtro de óleo",
      "Troca do filtro de ar",
      "Troca do filtro de combustível",
      "Troca do filtro de cabine",
      "Troca do óleo de câmbio",
      "Troca do óleo da caixa de direção",
      "Troca do fluido de freio",
      "Troca do fluido de embreagem",
    ],
  },
  {
    group: "Freios",
    items: [
      "Substituição de pastilhas dianteiras",
      "Substituição de pastilhas traseiras",
      "Substituição de lonas de freio traseiras",
      "Substituição de disco de freio dianteiro",
      "Substituição de disco de freio traseiro",
      "Retífica de tambor de freio",
      "Reparo de cilindro mestre de freio",
      "Sangria do sistema de freio",
    ],
  },
  {
    group: "Suspensão & Direção",
    items: [
      "Substituição de amortecedor dianteiro",
      "Substituição de amortecedor traseiro",
      "Substituição de mola dianteira",
      "Substituição de mola traseira",
      "Substituição de barra estabilizadora",
      "Substituição de bucha de suspensão",
      "Substituição de pivô",
      "Substituição de terminal de direção",
      "Substituição de caixa de direção",
      "Alinhamento de direção",
      "Balanceamento de rodas",
    ],
  },
  {
    group: "Motor",
    items: [
      "Troca da correia dentada",
      "Troca da correia acessórios",
      "Troca do tensor da correia",
      "Troca da bomba d'água",
      "Troca da bomba de óleo",
      "Limpeza de bicos injetores",
      "Limpeza do corpo de borboleta",
      "Troca de velas de ignição",
      "Troca de cabos de ignição",
      "Troca da bobina de ignição",
      "Troca de junta da tampa de válvulas",
      "Retífica do cabeçote",
      "Substituição da corrente do motor",
    ],
  },
  {
    group: "Arrefecimento",
    items: [
      "Troca do líquido de arrefecimento",
      "Substituição do radiador",
      "Substituição do reservatório de expansão",
      "Troca do termostato",
      "Troca da mangueira do radiador",
      "Substituição da bomba d'água",
      "Limpeza do sistema de arrefecimento",
    ],
  },
  {
    group: "Sistema Elétrico",
    items: [
      "Troca de bateria",
      "Revisão do sistema de carga",
      "Troca do alternador",
      "Troca do motor de partida",
      "Reparo de chicote elétrico",
      "Instalação de central multimídia",
      "Instalação de câmera de ré",
      "Troca de farol",
      "Troca de lâmpada",
      "Diagnóstico elétrico",
    ],
  },
  {
    group: "Ar-condicionado",
    items: [
      "Carga de gás R134a",
      "Troca do compressor de A/C",
      "Troca do filtro secador",
      "Troca da válvula de expansão",
      "Limpeza e higienização do A/C",
      "Troca do condensador",
    ],
  },
  {
    group: "Câmbio & Transmissão",
    items: [
      "Revisão da embreagem",
      "Troca do disco de embreagem",
      "Troca do platô de embreagem",
      "Troca do rolamento de embreagem",
      "Revisão da caixa de câmbio manual",
      "Revisão da caixa automática",
      "Troca do óleo do câmbio automático",
      "Troca de semi-eixo",
      "Troca de junta homocinética",
    ],
  },
  {
    group: "Diagnóstico",
    items: [
      "Diagnóstico eletrônico (scanner)",
      "Diagnóstico de motor",
      "Diagnóstico de transmissão",
      "Diagnóstico elétrico avançado",
      "Teste de compressão de cilindros",
    ],
  },
  {
    group: "Funilaria & Pintura",
    items: [
      "Polimento e lustração",
      "Higienização interna",
      "Lavagem completa",
      "Reparo de amassado pequeno",
      "Reparo de amassado médio",
    ],
  },
];
