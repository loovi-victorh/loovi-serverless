import { SAPQuotation } from "./handler";

export function processPlan(quotation: SAPQuotation): string {
  let planBase = "Roubo/Furto";

  if (
    quotation.itensCotacao.some((item) =>
      item.codigoItem.includes("SRV_SEGUROS_LTI")
    )
  ) {
    planBase += " + Colisão";
  }

  if (
    quotation.itensCotacao.some((item) =>
      item.codigoItem.includes("SRV_VIDROS")
    )
  ) {
    planBase += " + Vidros";
  }

  return planBase;
}
