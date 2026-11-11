import type { EngagementContent } from "@/types/engagement";

export function MemoryHeader({ content }: { content: EngagementContent }) {
  return (
    <header className="border-b border-line bg-surface/70 px-5 sm:px-8">
      <div className="memory-container flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <p className="font-semibold text-primary">{content.names.first} و{content.names.second}</p>
        <nav aria-label="روابط الموقع" className="flex flex-wrap items-center gap-5 text-sm text-muted">
          <a className="memory-text-link" href="#gallery">لحظاتنا</a>
          <a className="memory-text-link" href={content.albumUrl} target="_blank" rel="noopener noreferrer">
            الألبوم كله<span className="sr-only"> (بيفتح في صفحة جديدة)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
