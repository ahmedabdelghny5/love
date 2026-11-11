export function adjacentPhotoIndex(current: number, step: 1 | -1, count: number): number {
  if (count <= 0) return 0;
  return (current + step + count) % count;
}

export function navigationStep(key: string): 1 | -1 | undefined {
  // Match the right-to-left order of the Arabic gallery and viewer controls.
  if (key === "ArrowLeft") return 1;
  if (key === "ArrowRight") return -1;
  return undefined;
}
