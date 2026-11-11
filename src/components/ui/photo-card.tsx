import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

export function PhotoCard({
  children,
  caption,
  action,
  className = "",
  style,
  ...props
}: {
  children: ReactNode;
  caption?: string;
  action?: ReactNode;
  className?: string;
  style?: CSSProperties & { "--editorial-area"?: string; "--reveal-delay"?: string };
} & Omit<ComponentPropsWithoutRef<"figure">, "children" | "className" | "style">) {
  return (
    <figure className={`memory-photo-card ${className}`} style={style} {...props}>
      <div className="memory-photo-frame">{children}</div>
      {(caption || action) && (
        <figcaption className="memory-caption">
          {caption && <p>{caption}</p>}
          {action}
        </figcaption>
      )}
    </figure>
  );
}
