"use client";

import { useEffect } from "react";

export function PhotoCache() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Image-only worker: never caches HTML or interferes with Fast Refresh.
    void navigator.serviceWorker.register("/photo-cache-sw.js", { updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}
