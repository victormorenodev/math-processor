import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

    if (error) return <div className="page"><p className="error-text">{error}</p></div>;
    if (!request) return <div className="page"><p className="meta">Loading...</p></div>;

    const isFinal = request.status === "completed" || request.status === "error";

    return (
        <div className="page">
            <Link to="/" className="back-link">← Back</Link>

            <h1>Request</h1>
            <p className="meta">{request.id}</p>

            <div className="card-row" style={{ marginTop: 20 }}>
                <span className="badge">{request.status}</span>
                <span className="meta">{request.progress}%</span>
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${request.progress}%` }} />
            </div>

            <h2 style={{ marginTop: 24 }}>Logs</h2>
            <ul className="logs">
                {request.logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>

            {request.result !== null && (
                <p className="meta" style={{ marginTop: 16 }}>Result: {request.result}</p>
            )}

            {!isFinal && (
                <button
                    onClick={handleCancel}
                    className="button-secondary"
                    style={{ marginTop: 24 }}
                >
                    Cancel
                </button>
            )}
        </div>
    );
}