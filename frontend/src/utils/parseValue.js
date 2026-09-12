/* export const parseValue = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return +value.toFixed(2);

  if (typeof value === "string") {
    let clean = value;

    // Se houver vírgula e ponto, assume que o ponto é separador de milhar
    if (clean.includes(",") && clean.includes(".")) {
      clean = clean.split(".").join("");
    }

    // Substitui vírgula por ponto e remove tudo que não for dígito ou ponto
    clean = clean.replace(",", ".").replace(/[^0-9.]/g, "");

    // Mantém apenas o primeiro ponto decimal caso existam múltiplos
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }

    // Trunca em no máximo duas casas decimais
    if (parts[1] && parts[1].length > 2) {
      clean = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    const parsed = parseFloat(clean);
    return parsed ? +parsed.toFixed(2) : 0;
  }

  return 0;
}; */

export const parseValue = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return +value.toFixed(2);

  if (typeof value === "string") {
    let clean = value;

    if (clean.includes(",") && clean.includes(".")) {
      clean = clean.split(".").join("");
    }

    clean = clean.replace(",", ".");
    clean = clean.replace(/[^0-9.]/g, "");

    // Faz o parse e força a limitação de 2 casas decimais
    const parsed = parseFloat(clean);
    return parsed ? +parsed.toFixed(2) : 0;
  }

  return 0;
};

export const parseInputValue = (value) => {
  if (!value) return "";

  // Transforma vírgula em ponto e remove caracteres inválidos
  let val = String(value)
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  // Impede múltiplos pontos decimais
  const parts = val.split(".");
  if (parts.length > 2) {
    val = parts[0] + "." + parts.slice(1).join("");
  }

  // Limita a no máximo 2 casas decimais
  if (parts[1] && parts[1].length > 2) {
    val = `${parts[0]}.${parts[1].slice(0, 2)}`;
  }

  return val; // Retorna a STRING limpa para o input permitir a vírgula/ponto
};

export const getNumberValue = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};
