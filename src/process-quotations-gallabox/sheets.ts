/**
 * Função para enviar o lead para o Google Sheets através da API do Google + App Scripts
 */

import { GoogleSheetsService } from "../providers/google/sheets";

interface Lead {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  plan: string;
  coupon: string;
  fee: number;
  priceWithoutDiscount: number;
  totalPrice: number;
  discount: number;
  sellerId: number | string;
  quotationId: string;
  userId: string;
  userCode: string;
  createdAt: string;
  recoveryWhatsappSent: boolean;
  assignedToSalesTeam: boolean;
}

export async function appendLeadToGoogleSheets(lead: Lead): Promise<boolean> {
  const sheetsService = new GoogleSheetsService(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID!
  );

  const sheetName = process.env.STAGE === "prd" ? "prd" : "dev";
  const sheetRange = `${sheetName}!A2:O`;

  try {
    // Exemplo de adicionar uma linha
    await sheetsService.appendRow(sheetRange, [
      `${new Date(lead.createdAt).toLocaleDateString("pt-BR")} ${new Date(lead.createdAt).toLocaleTimeString("pt-BR")}`,
      lead.name,
      lead.email,
      lead.phone,
      lead.recoveryWhatsappSent,
      lead.cpf,
      lead.plan,
      lead.coupon.replace(/(_[A-Z]{2})$/, ""),
      lead.fee,
      lead.priceWithoutDiscount,
      lead.totalPrice,
      lead.discount,
      lead.sellerId,
      lead.quotationId,
      lead.userId,
      lead.userCode,
      lead.assignedToSalesTeam,
    ]);

    return true;
  } catch (error) {
    console.error("Erro:", error);
    return false;
  }
}
