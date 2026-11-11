/** Reports decoded images without fetching or copying any original asset. */
export function reportPhotoCache(url: string, loaded: boolean) {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.controller?.postMessage({
    type: loaded ? "PHOTO_LOADED" : "PHOTO_FAILED",
    url,
  });
}
