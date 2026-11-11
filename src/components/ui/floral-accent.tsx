export function FloralAccent({
  tone = "rose",
  className = "",
}: {
  tone?: "rose" | "lilac";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`memory-flower pointer-events-none ${tone === "lilac" ? "memory-flower-lilac" : ""} ${className}`}
    />
  );
}
