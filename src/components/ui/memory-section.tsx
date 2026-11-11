import type { ComponentPropsWithoutRef } from "react";

type MemorySectionProps = ComponentPropsWithoutRef<"section">;

export function MemorySection({ children, className = "", ...props }: MemorySectionProps) {
  return (
    <section className={`memory-section ${className}`} {...props}>
      <div className="memory-container">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  id,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  id?: string;
}) {
  return (
    <header data-reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
      {eyebrow && <p className="memory-eyebrow mb-3">{eyebrow}</p>}
      <h2 id={id} className="text-heading font-semibold text-ink text-balance">
        {title}
      </h2>
      {description && <p className="memory-copy mt-4">{description}</p>}
    </header>
  );
}
