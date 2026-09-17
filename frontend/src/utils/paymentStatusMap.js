export const paymentStatusMap = {
  "Aguardando Pagamento": 1,
  "Pago Parcialmente": 2,
  "Pago Integralmente": 3,
  "Sem Pagamento": 4,
};

export const paymentStatusReverseMap = {
  1: "Aguardando Pagamento",
  2: "Pago Parcialmente",
  3: "Pago Integralmente",
  4: "Sem Pagamento",
};

export const paymentStatusReverseMapBadge = {
  1: "awaiting-payment",
  2: "partially-paid",
  3: "fully-paid",
  4: "no-required-to-pay",
};
