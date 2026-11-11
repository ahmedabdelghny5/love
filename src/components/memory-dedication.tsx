import { FloralAccent } from "@/components/ui/floral-accent";
import { MemorySection } from "@/components/ui/memory-section";

export function MemoryDedication({ message }: { message: string }) {
  return (
    <MemorySection id="dedication" aria-labelledby="dedication-title" className="pt-20">
      <div data-reveal className="memory-dedication memory-dedication-panel mx-auto max-w-4xl text-center lg:max-w-2xl">
        <FloralAccent tone="lilac" className="mx-auto mb-6 scale-75" />
        <h2 id="dedication-title" className="memory-eyebrow mb-4">وعدنا لبعض</h2>
        <blockquote className="text-heading font-medium text-ink text-balance">
          <p>{message}</p>
        </blockquote>
      </div>
    </MemorySection>
  );
}
