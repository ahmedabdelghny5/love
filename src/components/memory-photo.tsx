"use client";

import { useCallback, useEffect, useState } from "react";
import { reportPhotoCache } from "@/lib/photo-cache";
import type { Photo } from "@/types/engagement";

type MemoryPhotoProps = {
  photo: Photo;
  albumUrl: string;
  priority?: boolean;
  frame?: "portrait" | "natural" | "viewer" | "hero";
};

export function MemoryPhoto({
  photo,
  albumUrl,
  priority = false,
  frame = "portrait",
}: MemoryPhotoProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [fullSizeReady, setFullSizeReady] = useState(false);
  const [failedFullSize, setFailedFullSize] = useState(false);
  const [upgradePending, setUpgradePending] = useState(
    frame === "viewer" && Boolean(photo.fullSrc && photo.fullSrc !== photo.src),
  );
  // The immersive hero needs the existing larger image immediately; errors
  // retain the same one-time verified display-size fallback as the viewer.
  const source = (frame === "hero" || fullSizeReady) && !failedFullSize ? photo.fullSrc ?? photo.src : photo.src;

  useEffect(() => {
    if (frame !== "viewer" || !photo.fullSrc || photo.fullSrc === photo.src) return;
    let active = true;
    const larger = new Image();
    larger.decoding = "async";
    const finish = () => {
      if (!active) return;
      active = false;
      window.clearTimeout(timeout);
      larger.onload = null;
      larger.onerror = null;
      setUpgradePending(false);
    };
    // Keep the cached gallery photo visible if Google's larger variant stalls.
    const timeout = window.setTimeout(() => {
      finish();
      larger.src = "";
    }, 8_000);
    larger.onload = () => {
      void larger.decode().then(() => {
        if (!active) return;
        reportPhotoCache(photo.fullSrc!, true);
        setStatus("loading");
        setFullSizeReady(true);
        finish();
      }).catch(finish);
    };
    larger.onerror = () => { reportPhotoCache(photo.fullSrc!, false); finish(); };
    larger.src = photo.fullSrc;

    return () => {
      active = false;
      window.clearTimeout(timeout);
      larger.onload = null;
      larger.onerror = null;
      larger.src = "";
    };
  }, [frame, photo.fullSrc, photo.src]);

  const handleError = useCallback(() => {
    reportPhotoCache(source, false);
    if (source !== photo.src) {
      setFailedFullSize(true);
      setStatus("loading");
    } else {
      setStatus("error");
    }
  }, [photo.src, source]);

  const captureImage = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) {
      if (image.naturalWidth > 0) { setStatus("loaded"); reportPhotoCache(image.currentSrc || image.src, true); }
      else handleError();
    }
  }, [handleError]);

  return (
    <div
      className={"memory-photo-media " + (frame === "viewer" ? "memory-viewer-media" : "")}
      style={{ aspectRatio: frame === "viewer" || frame === "hero" ? undefined : frame === "natural" ? photo.width + " / " + photo.height : "4 / 5" }}
      data-photo-id={photo.id}
      data-resolution={source === photo.fullSrc ? "full" : "display"}
      data-upgrade-pending={upgradePending}
      aria-busy={status === "loading"}
    >
      <div className="memory-photo-placeholder" aria-hidden="true" />
      <img
        key={source}
        ref={captureImage}
        src={source}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        hidden={status === "error"}
        style={{ objectPosition: photo.objectPosition }}
        onLoad={() => { setStatus("loaded"); reportPhotoCache(source, true); }}
        onError={handleError}
      />
      {status === "loading" && (
        <span className="memory-photo-status" role="status">بنحمّل الصورة…</span>
      )}
      {status === "error" && (
        <div className="memory-photo-placeholder memory-photo-failure" role="status">
          <p>الصورة مش بتفتح دلوقتي.</p>
          <a className="memory-text-link text-primary underline" href={albumUrl} target="_blank" rel="noopener noreferrer">
            شوفها في الألبوم كله
            <span className="sr-only"> (بيفتح في صفحة جديدة)</span>
          </a>
        </div>
      )}
      <noscript><style>{".memory-photo-status { display: none; }"}</style></noscript>
    </div>
  );
}
