import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest, cancelRequest } from "../api";
import type { ProcessRequest } from "../types";

const POLL_INTERVAL_MS = 1000;

export function RequestDetail() {
    const { id } = useParams();
    const [request, setRequest] = useState<ProcessRequest | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const requestId = id;
        let cancelled = false;
        let intervalId: number;

        async function poll() {
            try {
                const data = await getRequest(requestId);
                if (cancelled) return;
                setRequest(data);
                if (data.status === "completed" || data.status === "error") {
                    clearInterval(intervalId);
                }
            } catch {
                if (!cancelled) setError("Failed to fetch request.");
            }
        }

        poll();
        intervalId = window.setInterval(poll, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [id]);

    async function handleCancel() {
        if (!id) return;
        const requestId = id;
        try {
            setRequest(await cancelRequest(requestId));
        } catch {
            setError("Failed to cancel request.");
        }
    }

    if (error) return <p>{error}</p>;
    if (!request) return <div>Loading...</div>;

    const isFinal = request.status === "completed" || request.status === "error";
    
    return (
        <div>
            <h2>Request {request.id}</h2>
            <p>Status: {request.status}</p>
            <p>Progress: {request.progress}%</p>
            <ul>
                {request.logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
            {request.result !== null && <p>Result: {request.result}</p>}
            {!isFinal && <button onClick={handleCancel}>Cancel</button>}
        </div>
    );
}