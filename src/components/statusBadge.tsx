// Stamp-style status badge — mono small caps with a tinted ink pad.
// Statuses arrive capitalised from the API ("Applied", "Interview Scheduled", …)
const STATUS_STYLES: Record<string, string> = {
  applied: "text-dusk border-dusk/40 bg-dusk/10",
  "interview scheduled": "text-marigold border-marigold/40 bg-marigold/10",
  "interview completed": "text-sage border-sage/45 bg-sage/10",
  "in progress": "text-marigold border-marigold/40 bg-marigold/10",
  accepted: "text-moss border-moss/40 bg-moss/10",
  offer: "text-moss border-moss/40 bg-moss/10",
  rejected: "text-rose border-rose/40 bg-rose/10",
  withdrawn: "text-ink-faint border-line bg-ink/5",
  declined: "text-ink-faint border-line bg-ink/5",
  "on hold": "text-ink-faint border-line bg-ink/5",
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const style =
    STATUS_STYLES[status.toLowerCase()] ?? "text-ink-faint border-line bg-ink/5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] whitespace-nowrap ${style}`}
    >
      <span className="block h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
};

export default StatusBadge;
