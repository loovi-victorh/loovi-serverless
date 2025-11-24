import { google } from "googleapis";

// Interface para tipagem dos dados
interface SheetData {
  // Defina aqui os campos que você precisa manipular
  [key: string]: any;
}

export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
    // Configurar as credenciais
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  async appendRow(range: string, values: any[]) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar linha na planilha:", error);
      throw new Error("Falha ao adicionar dados na planilha");
    }
  }

  async readSheet(range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      return response.data.values;
    } catch (error) {
      console.error("Erro ao ler planilha:", error);
      throw new Error("Falha ao ler dados da planilha");
    }
  }

  async updateRange(range: string, values: any[][]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar planilha:", error);
      throw new Error("Falha ao atualizar dados na planilha");
    }
  }
}
