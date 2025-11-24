import { fetchWithRetry } from "../../utils/fetch-retry";
import { SapQuotation, SapQuotationDirty } from "./sap-types";

export class Sap {
  async getSapQuotationRaw(
    quotationId: string
  ): Promise<SapQuotationDirty | undefined> {
    console.info("[getSapQuotationRaw] getting quotation raw", {
      quotationId,
    });
    const payload = {
      url: "https://sapiis.loovi.com.br:60000/cotacao/Api/v1/obterDadosCotacao",
      metodo: "GET",
      headers: {
        requester: "Portal",
        cotacao: quotationId.replace("\r", ""),
      },
      body: {},
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    const response = await fetchWithRetry<string>(
      "https://ticjxjby64.execute-api.us-east-1.amazonaws.com/producao/proxy/v2/SAP",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.SAP_PRD_API_KEY!,
        },
        body: payloadBase64,
      }
    );

    const dataBase64 = response;

    const data = Buffer.from(dataBase64, "base64").toString("utf-8");

    const quotationDirty = JSON.parse(data) as SapQuotationDirty;

    console.info("[get-sap-quotation-raw] quotation found");

    return quotationDirty;
  }

  async getSapQuotations(
    phone: string
  ): Promise<SapQuotationDirty[] | undefined> {
    try {
      let phoneFormatted = phone.replace(/\D/g, "");
      if (phoneFormatted.startsWith("55")) {
        phoneFormatted = phoneFormatted.substring(2);
      }

      const payload = `{ 	"url": "https://sapiis.loovi.com.br:60000/cotacao/Api/v1/obterCotacoesPorTelefone/${phoneFormatted}", 	"metodo": "GET", 	"headers": { 		"requester": "Finanto" }}`;

      const payloadBase64 = Buffer.from(payload).toString("base64");

      const signal = AbortSignal.timeout(15000);
      const response = await fetchWithRetry<string>(
        "https://ticjxjby64.execute-api.us-east-1.amazonaws.com/producao/proxy/v2/SAP",
        {
          method: "POST",
          headers: {
            "x-api-key": process.env.SAP_PRD_API_KEY!,
          },
          body: payloadBase64,
          signal,
        }
      );

      const dataBase64 = response;

      const data = Buffer.from(dataBase64, "base64").toString("utf-8");

      const quotations = JSON.parse(data) as SapQuotationDirty[];

      if (typeof quotations === "string") {
        return [];
      }

      return quotations;
    } catch (error) {
      console.error(
        { phone },
        "[sap-get-sap-quotations] Error getting sap quotations",
        {
          error: error instanceof Error ? error.message : JSON.stringify(error),
        }
      );
      throw error;
    }
  }

  async getLastQuotation(
    phone: string
  ): Promise<SapQuotationDirty | undefined> {
    try {
      const sapQuotations = await this.getSapQuotations(phone);

      if (sapQuotations && sapQuotations.length > 0) {
        const quotation = await this.getSapQuotationRaw(
          sapQuotations[sapQuotations.length - 1].idCotacao
        );

        return quotation;
      }

      return undefined;
    } catch (error) {
      console.error(
        { phone },
        "[sap-get-last-quotation] Error getting last quotation",
        {
          error: error instanceof Error ? error.message : JSON.stringify(error),
        }
      );
      throw error;
    }
  }
}
