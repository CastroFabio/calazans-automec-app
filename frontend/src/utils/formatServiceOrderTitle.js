const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const formatServiceOrderTitle = (order) => {
  const maintenances = safeArray(order?.itemMaintenances);
  const count = maintenances.length;

  if (count === 0) {
    return `Ordem de Serviço #${order?.id || ""}`;
  }

  if (count === 1) {
    return maintenances[0]?.maintenancejob?.name || "Serviço";
  }

  const firstName = maintenances[0]?.maintenancejob?.name || "Serviço";
  return `${firstName} +${count - 1}`;
};
