import { useState, useEffect } from "react";
import { Inbox, Check, X, AlertCircle } from "lucide-react";
import { authedFetch } from "@/lib/authedFetch";
import { useJobApplicationStore } from "@/store/jobApplicationStore";

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
  const fetchApplications = useJobApplicationStore(
    (state) => state.fetchApplications
  );
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueData>({
    count: 0,
    emails: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Ids currently being approved/rejected — drives a per-row spinner instead
  // of blanking the whole list while one action is in flight.
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // `silent` skips the loading flag so background reconciliation (after an
  // approve/reject already updated the list optimistically) doesn't blank
  // the queue and flash a spinner over rows the user just acted on.
  const fetchReviewQueue = async ({ silent = false } = {}) => {
    if (!uid) return;

    if (!silent) setLoading(true);
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
      if (!silent) setError("Failed to load review queue");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewQueue();
  }, [uid]);

  const handleApprove = async (emailId: string) => {
    setProcessingIds((prev) => new Set(prev).add(emailId));
    setError(null);
    try {
      const response = await authedFetch(
        `${API_BASE_URL}/email-processing/approve/${emailId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to approve application");
      }

      // Drop the row instantly rather than waiting on a full requeue —
      // reconcile with the server quietly in the background afterward.
      setReviewQueue((prev) => ({
        count: Math.max(0, prev.count - 1),
        emails: prev.emails.filter((email) => email.id !== emailId),
      }));

      // Approving files a new job application — refresh the shared
      // applications list so the dashboard/list reflect it immediately.
      fetchApplications();
      fetchReviewQueue({ silent: true });
    } catch (error) {
      console.error("Error approving application:", error);
      setError("Failed to approve application");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(emailId);
        return next;
      });
    }
  };

  const handleReject = async (emailId: string) => {
    setProcessingIds((prev) => new Set(prev).add(emailId));
    setError(null);
    try {
      const response = await authedFetch(
        `${API_BASE_URL}/email-processing/reject/${emailId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to reject application");
      }

      // Drop the row instantly, then reconcile quietly in the background.
      setReviewQueue((prev) => ({
        count: Math.max(0, prev.count - 1),
        emails: prev.emails.filter((email) => email.id !== emailId),
      }));

      fetchReviewQueue({ silent: true });
    } catch (error) {
      console.error("Error rejecting application:", error);
      setError("Failed to reject application");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(emailId);
        return next;
      });
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-clay/40 bg-card p-6 lg:p-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-dashed border-line pb-4">
        <div className="flex items-center gap-2.5">
          <Inbox className="h-4 w-4 text-clay" strokeWidth={2} />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            Review queue
          </span>
        </div>
        <span className="rounded-full border border-clay/40 bg-clay/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
          {reviewQueue.count} waiting
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-4 text-sm text-ink-soft">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-dashed border-clay" />
          Checking your queue...
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 py-2 text-sm text-rose">
          <AlertCircle className="h-4 w-4" strokeWidth={2} />
          {error}
        </div>
      ) : reviewQueue.emails.length === 0 ? (
        <p className="py-2 text-sm leading-relaxed text-ink-soft">
          Nothing waiting — your inbox is quiet. Anything the AI isn&apos;t sure
          about will land here for your say-so.
        </p>
      ) : (
        <ul className="divide-y divide-dashed divide-line">
          {reviewQueue.emails.map((email) => {
            const isProcessing = processingIds.has(email.id);
            return (
              <li
                key={email.id}
                className="flex flex-col gap-4 py-5 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg text-ink">
                    {email.subject}
                  </h3>
                  <p className="mt-0.5 truncate font-mono text-[11px] tracking-[0.06em] text-ink-faint">
                    from {email.from}
                  </p>
                  {email.extractedData && (
                    <p className="mt-2 text-sm text-ink-soft">
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
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleApprove(email.id)}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-moss disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                    ) : (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(email.id)}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-rose/50 hover:text-rose disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Skip
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
