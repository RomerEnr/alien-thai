/** Runs `callback` at most once per animation frame, however often it is asked. */
export function throttleToFrame(callback: () => void): () => void {
  let pending = false;
  return () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      callback();
    });
  };
}

/** Calls `callback` once per frame while the page scrolls. */
export function onScrollFrame(callback: () => void): void {
  addEventListener('scroll', throttleToFrame(callback), { passive: true });
}
