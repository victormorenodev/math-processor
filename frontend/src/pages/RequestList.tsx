import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listRequests } from "../api";
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (requests.length === 0) return <p>No requests yet.</p>;

    return (
        <div>
            <Link to="/new">New request</Link>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <Link to={`/requests/${request.id}`}>
                            {request.id} - {request.status} - {request.progress}%
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

}