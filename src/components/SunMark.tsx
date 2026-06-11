// Rising-sun brand mark. Inherits color via currentColor so it can sit
// in clay on paper, or cream on espresso.
export default function SunMark({
  className = "h-7 w-7",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      {/* rays */}
      <line x1="24" y1="6" x2="24" y2="12" />
      <line x1="9.5" y1="13.5" x2="13.7" y2="17.7" />
      <line x1="38.5" y1="13.5" x2="34.3" y2="17.7" />
      {/* half sun */}
      <path d="M13 33a11 11 0 0 1 22 0" fill="currentColor" stroke="none" />
      {/* horizon */}
      <line x1="5" y1="33" x2="43" y2="33" />
      <line x1="14" y1="40" x2="34" y2="40" strokeWidth="2.5" opacity="0.45" />
    </svg>
  );
}
