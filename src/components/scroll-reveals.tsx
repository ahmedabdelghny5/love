"use client";

import { useEffect } from "react";

// Content is visible by default, including without JavaScript or observer support.
// We animate only once it intersects, never hide offscreen keyboard targets.
export function ScrollReveals() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;
    const start = () => {
      observer?.disconnect();
      if (media.matches) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0.08 });
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((node) => observer?.observe(node));
    };
    start();
    media.addEventListener("change", start);
    return () => { observer?.disconnect(); media.removeEventListener("change", start); };
  }, []);
  return null;
}
