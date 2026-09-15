export function formatarCelular(numero) {
  // Verifica se o número é válido antes de tentar usar replace
  if (!numero) {
    return "";
  }

  // Converte para string caso seja número
  let numeros = String(numero);

  // Remove todos os caracteres não numéricos
  numeros = numeros.replace(/\D/g, "");

  // Se não tiver números, retorna vazio
  if (numeros.length === 0) {
    return "";
  }

  // Formata conforme o tamanho
  if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7, 11)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6, 10)}`;
  } else if (numeros.length === 9) {
    return `${numeros.substring(0, 5)}-${numeros.substring(5, 9)}`;
  } else if (numeros.length === 8) {
    return `${numeros.substring(0, 4)}-${numeros.substring(4, 8)}`;
  } else {
    // Retorna os números sem formatação se não encaixar em nenhum padrão
    return numeros;
  }
}

export const cleanPhoneNumber = (numero) => {
  if (!numero) return "";
  let cleanNumero = String(numero);
  return cleanNumero.replace(/\D/g, "");
};
