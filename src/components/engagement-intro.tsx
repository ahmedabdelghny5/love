import type { ReactNode } from "react";
import type { EngagementContent } from "@/types/engagement";
import { MemoryLink } from "@/components/ui/memory-controls";

type EngagementIntroProps = {
  content: EngagementContent;
  cover?: ReactNode;
};

export function EngagementIntro({ content, cover }: EngagementIntroProps) {
  const firstName = content.names.first === "\u0639\u0644\u0649" ? "\u0639\u0644\u064a" : content.names.first;

  return (
    <section aria-labelledby="memory-title" className="memory-hero memory-cinematic-hero">
      {cover && <div className="memory-hero-background">{cover}</div>}
      <div className="memory-hero-gradient" aria-hidden="true" />
      <div className="memory-hero-content">
        <div className="memory-hero-heading animate-memory-enter">
          <p className="memory-eyebrow">{content.title}</p>
          <h1 id="memory-title" className="memory-hero-names">
            {firstName} <span>و</span> {content.names.second}
          </h1>
          {content.date && content.dateLabel && (
            <time dateTime={content.date} className="memory-hero-date">{content.dateLabel}</time>
          )}
          <p className="memory-copy">{content.supportingMessage}</p>
        </div>
        <div className="memory-hero-actions">
          <MemoryLink href="#gallery">شوفوا صورنا <span aria-hidden="true">↓</span></MemoryLink>
          <a className="memory-text-link" href={content.albumUrl} target="_blank" rel="noopener noreferrer">
            الألبوم كله<span className="sr-only"> (بيفتح في صفحة جديدة)</span>
          </a>
        </div>
      </div>
      <a href="#dedication" className="memory-scroll-cue" aria-label="انتقل إلى وعدنا لبعض">
        <span aria-hidden="true" className="memory-scroll-line" />
        <span>ذكريات هتفضل معانا</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
