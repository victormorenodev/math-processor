import type { ProcessRequest, CreateRequestPayload } from "./types";

const BASE_URL = "http://localhost:8000";

export async function createRequest(payload: CreateRequestPayload): Promise<ProcessRequest> {
    const response = await fetch(`${BASE_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Failed to create request`);
    return response.json();
}

export async function listRequests(): Promise<ProcessRequest[]> {
    const response = await fetch(`${BASE_URL}/requests`);
    if (!response.ok) throw new Error(`Failed to list requests`);
    return response.json();
}

export async function getRequest(id: string): Promise<ProcessRequest> {
    const response = await fetch(`${BASE_URL}/requests/${id}`);
    if (!response.ok) throw new Error(`Failed to get fetch request`);
    return response.json();
}

export async function cancelRequest(id: string): Promise<ProcessRequest> {
    const response = await fetch(`${BASE_URL}/requests/${id}/cancel`, { method: "POST" });
    if (!response.ok) throw new Error(`Failed to cancel request`);
    return response.json();
}

export async function clearRequests(): Promise<void> {
    const response = await fetch(`${BASE_URL}/requests`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Failed to clear requests`);
}