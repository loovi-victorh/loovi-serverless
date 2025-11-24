export type SapQuotationDirty = {
  codigoCliente: string;
  cpf: string;
  descontos: number;
  email: string;
  idCotacao: string;
  codigoVendedor: string;
  idPlano: string;
  idCampanha: string;
  nomeCliente: string;
  vendedor: number;
  status: "Venda em aberto" | string;
  statusProposta: "Nova" | string;
  telefone: string;
  valorAdesao: number;
  valorFrete: number;
  valorProposta: number;
  valorSemDesconto: number;
  valorTotal: number;
  itensCotacao: {
    codigoItem: string;
    descricao: string;
  }[];
};
export type SapQuotation = {
  quotationId: string;
  sellerId: string;
  price: number;
  priceWithoutDiscount: number;
};
