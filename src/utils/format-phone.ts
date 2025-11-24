export function formatBrazilianPhone(input: string): string {
  if (typeof input !== "string") {
    throw new Error("Input deve ser uma string");
  }

  // Remove todos os caracteres não numéricos
  const digits = input.replace(/\D/g, "");

  // Verifica tamanho mínimo
  if (digits.length < 10) {
    throw new Error("Número deve ter pelo menos 10 dígitos");
  }

  let processedDigits = digits;

  // Remove código do país 55 se presente no início
  if (processedDigits.startsWith("55")) {
    processedDigits = processedDigits.substring(2);
  }

  // Após remover 55, deve ter pelo menos 10 dígitos (DDD + número)
  if (processedDigits.length < 10) {
    throw new Error("Número inválido após processamento");
  }

  // Se tem mais de 11 dígitos após remover o 55, é inválido
  if (processedDigits.length > 11) {
    throw new Error("Número muito longo");
  }

  let ddd: string;
  let phoneNumber: string;

  if (processedDigits.length === 10) {
    // Formato: DDNNNNNNNNN (sem o 9)
    ddd = processedDigits.substring(0, 2);
    phoneNumber = processedDigits.substring(2);

    // Adiciona o 9 no início do número
    phoneNumber = "9" + phoneNumber;
  } else if (processedDigits.length === 11) {
    // Formato: DDNNNNNNNNN (com ou sem o 9)
    ddd = processedDigits.substring(0, 2);
    phoneNumber = processedDigits.substring(2);

    // Verifica se já tem o 9, se não tem, adiciona
    if (!phoneNumber.startsWith("9")) {
      phoneNumber = "9" + phoneNumber;
    }
  } else {
    throw new Error("Formato de número inválido");
  }

  // Valida DDD (códigos válidos no Brasil: 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99)
  const validDDDs = new Set([
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21",
    "22",
    "24",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "54",
    "55",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "71",
    "73",
    "74",
    "75",
    "77",
    "79",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
  ]);

  if (!validDDDs.has(ddd)) {
    throw new Error(`DDD inválido: ${ddd}`);
  }

  // Verifica se o número tem exatamente 9 dígitos após adicionar o 9
  if (phoneNumber.length !== 9) {
    throw new Error("Número de celular deve ter 9 dígitos após o DDD");
  }

  // Retorna no formato: 55 + DDD + 9NNNNNNNN
  return "55" + ddd + phoneNumber;
}

// Função de teste para validar os exemplos
export function testFormatter(): void {
  const testCases = [
    "5521965712960",
    "552165712960",
    "21965712960",
    "2165712960",
    "(21)965712960",
    "(21)65712960",
    "(21) 96571-2960",
  ];

  console.log("Testando formatador de celular brasileiro:");
  testCases.forEach((input) => {
    try {
      const result = formatBrazilianPhone(input);
      console.log(`${input} -> ${result}`);
    } catch (error) {
      console.log(`${input} -> ERRO: ${error}`);
    }
  });
}
