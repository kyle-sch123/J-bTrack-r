import { useState, useEffect } from "react";
import { authedFetch } from "@/lib/authedFetch";

// Matches what the AI pipeline extracted. The backend serializes these with
// PascalCase keys (PropertyNamingPolicy = null), so mirror that here.
interface ExtractedData {
  CompanyName?: string | null;
  Position?: string | null;
  ApplicationStatus?: string | null;
  Confidence?: number;
}

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  extractedData?: ExtractedData | null;
  processingStatus: string;
}

interface ReviewQueueData {
  count: number;
  emails: Email[];
}

export default function ReviewQueue({ uid }: { uid: string }) {
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueData>({
    count: 0,
    emails: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchReviewQueue = async () => {
    if (!uid) return;

    setLoading(true);
    setError(null);
    try {
      const response = await authedFetch(
        `${API_BASE_URL}/email-processing/review-queue`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch review queue");
      }

      const data: ReviewQueueData = await response.json();
      setReviewQueue(data);
    } catch (error) {
      console.error("Error fetching review queue:", error);
      setError("Failed to load review queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewQueue();
  }, [uid]);

  const handleApprove = async (emailId: string) => {
    try {
      const response = await authedFetch(
        `${API_BASE_URL}/email-processing/approve/${emailId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to approve application");
      }

      // Refresh the queue after approval
      fetchReviewQueue();
    } catch (error) {
      console.error("Error approving application:", error);
      setError("Failed to approve application");
    }
  };

  const handleReject = async (emailId: string) => {
    try {
      const response = await authedFetch(
        `${API_BASE_URL}/email-processing/reject/${emailId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to reject application");
      }

      // Refresh the queue after rejection
      fetchReviewQueue();
    } catch (error) {
      console.error("Error rejecting application:", error);
      setError("Failed to reject application");
    }
  };

  if (loading) {
    return <div>Loading review queue...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-[#fc7435] p-4 rounded-2xl">
      <h2>Review Queue ({reviewQueue.count} pending)</h2>
      {reviewQueue.emails.length === 0 ? (
        <p>No pending applications to review.</p>
      ) : (
        <ul>
          {reviewQueue.emails.map((email) => (
            <li key={email.id} className="email-item">
              <div>
                <h3>{email.subject}</h3>
                <p>From: {email.from}</p>
                {email.extractedData && (
                  <p>
                    {email.extractedData.CompanyName ?? "Unknown company"}
                    {email.extractedData.Position
                      ? ` — ${email.extractedData.Position}`
                      : ""}
                    {email.extractedData.ApplicationStatus
                      ? ` (${email.extractedData.ApplicationStatus})`
                      : ""}
                    {typeof email.extractedData.Confidence === "number"
                      ? ` · ${Math.round(email.extractedData.Confidence)}% confidence`
                      : ""}
                  </p>
                )}
              </div>
              <div className="actions">
                <button onClick={() => handleApprove(email.id)}>Approve</button>
                <button onClick={() => handleReject(email.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
