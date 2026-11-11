import { FloralAccent } from "@/components/ui/floral-accent";
import { MemoryLink } from "@/components/ui/memory-controls";
import { MemorySection } from "@/components/ui/memory-section";
import type { EngagementContent } from "@/types/engagement";

export function MemoryFooter({ content }: { content: EngagementContent }) {
  return (
    <footer className="border-t border-line bg-sage/40">
      <MemorySection aria-labelledby="closing-title">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <FloralAccent className="mx-auto mb-7" />
          <h2 id="closing-title" className="text-heading font-medium text-ink text-balance">
            {content.closingMessage}
          </h2>
          <MemoryLink href={content.albumUrl} target="_blank" rel="noopener noreferrer" className="mt-8">
            الألبوم كله
            <span className="sr-only"> (بيفتح في صفحة جديدة)</span>
          </MemoryLink>
          <p className="mt-8 text-sm leading-loose text-muted">
            {content.names.first} و{content.names.second}
            {content.dateLabel && <> · {content.dateLabel}</>}
          </p>
        </div>
      </MemorySection>
    </footer>
  );
}
