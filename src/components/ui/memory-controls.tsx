import type { ComponentPropsWithoutRef } from "react";

type ControlVariant = "primary" | "secondary";

function controlClasses(variant: ControlVariant, className: string) {
  return `memory-button ${variant === "secondary" ? "memory-button-secondary" : ""} ${className}`;
}

export function MemoryLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"a"> & { variant?: ControlVariant }) {
  return <a className={controlClasses(variant, className)} {...props} />;
}

export function MemoryButton({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: ControlVariant }) {
  return <button type={type} className={controlClasses(variant, className)} {...props} />;
}
