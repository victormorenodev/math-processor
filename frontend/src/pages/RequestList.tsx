import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearRequests, listRequests } from "../api";
import type { ProcessRequest } from "../types";

export function RequestList() {
    const [requests, setRequests] = useState<ProcessRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listRequests()
            .then(setRequests)
            .catch(() => setError("Failed to load requests"))
            .finally(() => setLoading(false));
    }, []);

    async function handleClear() {
        try {
            await clearRequests();
            setRequests([]);
        } catch {
            setError("Failed to clear requests.");
        }
    }

    if (loading) return <div className="page"><p className="meta">Loading...</p></div>;
    if (error) return <div className="page"><p className="error-text">{error}</p></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Requests</h1>
                <div className="card-row" style={{ gap: 8 }}>
                    {requests.length > 0 && (
                        <button onClick={handleClear} className="button-secondary">
                            Clear all
                        </button>
                    )}
                    <Link to="/new" className="button">New request</Link>
                </div>
            </div>

            {requests.length === 0 ? (
                <p className="meta">No requests yet.</p>
            ) : (
                <ul className="list">
                    {requests.map((request) => (
                        <li key={request.id}>
                            <Link to={`/requests/${request.id}`} className="card">
                                <div className="card-row">
                                    <span>{request.id}</span>
                                    <span className="badge">{request.status}</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${request.progress}%` }} />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}