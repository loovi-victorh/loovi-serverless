import { fetchWithRetry } from "../utils/fetch-retry";

export type GallaboxTeamMember = {
  name: string;
  email: string;
  id: string;
  accounts: {
    accountId: string;
    roleId: string;
    availability: string;
    teamIds: string[];
    channelIds: string[];
    createdAt: string;
    updatedAt: string;
  }[];
  exists: boolean;
};

export class Gallabox {
  async getTeam(): Promise<GallaboxTeamMember[]> {
    try {
      const response = await fetchWithRetry<GallaboxTeamMember[]>(
        `${process.env.GALLABOX_API_URL}/users?limit=100`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apiSecret: process.env.GALLABOX_API_SECRET!,
            apiKey: process.env.GALLABOX_API_KEY!,
          },
        }
      );

      console.log("[gallabox][get-team] found team members", {
        count: response.length,
      });

      return response;
    } catch (error) {
      console.error("[gallabox][get-team] error", { error });
      return [];
    }
  }

  filterAvailableTeamMembers(teamMembers: GallaboxTeamMember[]) {
    return teamMembers.filter(
      (member) =>
        member.exists &&
        member.accounts.some(
          (account) =>
            account.teamIds.includes(process.env.GALLABOX_SALES_TEAM_ID!) &&
            account.availability === "Available"
        )
    );
  }

  roundRobin(teamMembers: GallaboxTeamMember[]) {
    const availableTeamMembers = this.filterAvailableTeamMembers(teamMembers);
    const randomIndex = Math.floor(Math.random() * availableTeamMembers.length);

    return availableTeamMembers[randomIndex];
  }

  async assignConversationToTeam({
    phone,
    conversationId,
  }: {
    phone: string;
    conversationId: string;
  }) {
    try {
      console.log(
        "[gallabox][assign-conversation-to-team] trying to assign conversation to team",
        {
          phone,
          conversationId,
        }
      );

      const response = await fetchWithRetry<any>(
        `${process.env.GALLABOX_API_URL}/conversations/${conversationId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiSecret: process.env.GALLABOX_API_SECRET!,
            apiKey: process.env.GALLABOX_API_KEY!,
          },
          body: JSON.stringify({
            teamId: process.env.GALLABOX_SALES_TEAM_ID!,
            restrictCrossTeamMapping: true,
          }),
        }
      );

      console.log("[gallabox][assign-conversation-to-team] success", {
        response,
      });

      return true;
    } catch (error) {
      console.error("[gallabox][assign-conversation-to-team] error", { error });
      return false;
    }
  }

  async mentionTeamMember(contactPhone: string, teamMemberId: string) {
    try {
      const now = new Date();

      // format date into Intl PT-BR
      const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(now);

      const response = await fetchWithRetry(
        `${process.env.GALLABOX_API_URL}/conversations/phone/${contactPhone}/mention?channelId=${process.env.GALLABOX_PROD_CHANNEL_ID}`,
        {
          method: "POST",
          body: JSON.stringify({
            mentions: [teamMemberId],
            type: "text",
            text: {
              body: `(Automação) Esse contato gerou uma nova cotação em ${formattedDate}`,
            },
          }),
          headers: {
            "Content-Type": "application/json",
            apiSecret: process.env.GALLABOX_API_SECRET!,
            apiKey: process.env.GALLABOX_API_KEY!,
          },
        }
      );

      console.log("[gallabox][mention-team-member] success", {
        response,
      });
    } catch (error) {
      console.error("[gallabox][mention-team-member] error", { error });
    }
  }
}
