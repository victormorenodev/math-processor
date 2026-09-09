export type RequestStatus = "pending" | "processing" | "completed" | "error";

export interface ProcessRequest {
  id: string;
  status: RequestStatus;
  progress: number;
  logs: string[];
  result: number | null;
}

export interface CreateRequestPayload {
  numbers: number[];
}