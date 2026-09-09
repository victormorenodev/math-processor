import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../api";

export function NewRequest() {
    const [numbers, setNumbers] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);
    
        const parsed = numbers
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n.length > 0)
            .map(Number);

        if (parsed.length === 0 || parsed.some(Number.isNaN)) {
            setError("Please enter a valid comma-separated list of numbers.");
            return;
        }

        setSubmitting(true);
        try {
            const request = await createRequest({ numbers: parsed });
            navigate(`/requests/${request.id}`);
        } catch {
            setError("Failed to create request.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter numbers (comma-separated):
                <input
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    placeholder="2, 5, 0"
                /> 
            </label>
            <button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
            </button>
            {error && <p>{error}</p>}
        </form>
    )
}