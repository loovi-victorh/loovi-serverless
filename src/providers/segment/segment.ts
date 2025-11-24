export interface SegmentEvent {
  id: string;
  time: string;
  detail: {
    receivedAt: string;
    userId?: string;
    event?: string;
    properties: {
      [key: string]: string | number | boolean;
    };
    context: {
      traits?: {
        email?: string;
        phone?: string;
        name?: string;
        id?: string;
      };
      [key: string]: any;
    };
    type: "page" | "track" | "identify";
    anonymousId?: string;
  };
}
