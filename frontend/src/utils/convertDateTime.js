const formatLocalDateTime = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  // The "T" is a required separator between date and time
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatLocalDateTimeStringISO = (dateString) => {
  // Cria objeto Date a partir da string ISO
  const date = new Date(dateString);

  // Formata para timezone local (America/Sao Paulo)
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Formato brasileiro: DD/MM/YYYY HH:MM
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export { formatLocalDateTime, formatLocalDateTimeStringISO };
