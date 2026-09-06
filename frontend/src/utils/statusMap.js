export const statusMap = {
  Pendente: 1,
  "Em andamento": 2,
  Concluído: 3,
  Aberta: 4,
  "Aguardando peças": 5,
  Cancelada: 6,
  "Ainda a pagar": 7,
};

export const statusReverseMap = {
  1: "Pendente",
  2: "Em andamento",
  3: "Concluído",
  4: "Aberta",
  5: "Aguardando peças",
  6: "Cancelada",
  7: "Ainda a pagar",
};

export const statusReverseMapBadge = {
  1: "pending",
  2: "progress",
  3: "done",
  4: "open",
  5: "awaiting-material",
  6: "cancelled",
  7: "awaiting-payment",
};
