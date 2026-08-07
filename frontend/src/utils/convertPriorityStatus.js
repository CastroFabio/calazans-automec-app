export const convertPriotity = (priority) => {
  switch (priority) {
    case 1:
      return "Pendente";
      break;
    case 2:
      return "Em andamento";
      break;
    case 3:
      return "Concluída";
      break;
    case 4:
      return "Aberta";
      break;
    case 5:
      return "Aguardando Peças";
      break;
    case 6:
      return "Cancelada";
      break;
    default:
      return "N/A";
      break;
  }
};

export const convertStatus = (status) => {
  switch (status) {
    case 1:
      return "Normal";
      break;
    case 2:
      return "Baixa";
      break;
    case 3:
      return "Alta";
      break;
    case 4:
      return "Urgente";
      break;
    default:
      return "N/A";
      break;
  }
};
