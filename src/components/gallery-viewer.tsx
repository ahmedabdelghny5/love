"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { MemoryPhoto } from "@/components/memory-photo";
import { adjacentPhotoIndex, navigationStep } from "@/lib/viewer-navigation";
import type { Photo } from "@/types/engagement";

type GalleryViewerProps = {
  photos: readonly Photo[];
  albumUrl: string;
  children: ReactNode;
};

export function GalleryViewer({ photos, albumUrl, children }: GalleryViewerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const swipeStart = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const isOpen = activeIndex !== null;
  const activePhoto = activeIndex === null ? undefined : photos[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (!dialog.open) dialog.showModal();
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      const trigger = triggerRef.current;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    // Navigating away from a focused error-state link can remove that node.
    if (isOpen && dialog?.open && !dialog.contains(document.activeElement)) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [activeIndex, isOpen]);

  function openFromGallery(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLAnchorElement>("a[data-viewer-photo]");
    if (!trigger || !event.currentTarget.contains(trigger)) return;
    const index = photos.findIndex((photo) => photo.id === trigger.dataset.viewerPhoto);
    if (index < 0) return;
    event.preventDefault();
    triggerRef.current = trigger;
    setActiveIndex(index);
  }

  function navigate(step: 1 | -1) {
    setActiveIndex((index) => index === null ? null : adjacentPhotoIndex(index, step, photos.length));
  }

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab") {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      const current = document.activeElement;
      if (first && last && ((event.shiftKey && current === first) || (!event.shiftKey && current === last))) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
      return;
    }
    const step = navigationStep(event.key);
    if (step !== undefined) {
      event.preventDefault();
      navigate(step);
    }
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" || !event.isPrimary) return;
    swipeStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function finishSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1);
  }

  function closeViewer() {
    setActiveIndex(null);
  }

  function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeViewer();
  }

  return (
    <div onClick={openFromGallery}>
      {children}
      <dialog
        ref={dialogRef}
        className="memory-viewer"
        aria-labelledby="viewer-title"
        aria-describedby="viewer-caption"
        onKeyDown={handleKeys}
        onCancel={(event) => { event.preventDefault(); closeViewer(); }}
        onClose={closeViewer}
        onClick={handleBackdrop}
      >
        <div className="memory-viewer-shell">
          <header className="memory-viewer-header">
            <div>
              <h2 id="viewer-title" className="text-lg font-semibold text-ink">لحظاتنا</h2>
              <p className="mt-1 text-sm text-muted" aria-live="polite" aria-atomic="true">
                {activeIndex !== null && <>الصورة {activeIndex + 1} من {photos.length}</>}
              </p>
            </div>
            <button ref={closeButtonRef} type="button" className="memory-button memory-button-secondary" onClick={closeViewer}>
              اقفل<span className="sr-only"> الصورة</span>
            </button>
          </header>
          <div className="memory-viewer-stage"
            onPointerDown={startSwipe} onPointerUp={finishSwipe}
            onPointerCancel={() => { swipeStart.current = null; }}
          >
            {activePhoto && (
              <MemoryPhoto
                key={activePhoto.id + ":" + activePhoto.src + ":" + activePhoto.fullSrc}
                photo={activePhoto}
                albumUrl={albumUrl}
                priority
                frame="viewer"
              />
            )}
          </div>
          <footer className="memory-viewer-footer">
            <p id="viewer-caption" className="text-center text-sm leading-loose text-muted" aria-live="polite" aria-atomic="true">
              {activePhoto?.caption ?? activePhoto?.alt ?? ""}
            </p>
            <nav className="memory-viewer-controls" aria-label="قلّب بين الصور">
              <button type="button" className="memory-button memory-button-secondary" onClick={() => navigate(-1)}>
                <span aria-hidden="true">→</span> اللي قبلها
              </button>
              <button type="button" className="memory-button" onClick={() => navigate(1)}>
                اللي بعدها <span aria-hidden="true">←</span>
              </button>
            </nav>
          </footer>
        </div>
      </dialog>
    </div>
  );
}
