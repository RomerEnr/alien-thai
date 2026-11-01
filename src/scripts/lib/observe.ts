/** Calls `callback` once, the first time `target` comes within `rootMargin` of the viewport. */
export function onceNear(target: Element, callback: () => void, options: IntersectionObserverInit = {}): void {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  }, options);
  observer.observe(target);
}

/**
 * Reports every time one of `targets` enters or leaves the viewport. With a
 * single `threshold`, a target counts as visible once at least that share of
 * it shows.
 */
export function watchVisibility(
  targets: Element[],
  callback: (target: Element, visible: boolean) => void,
  options: IntersectionObserverInit = {},
): void {
  const minRatio = typeof options.threshold === 'number' ? options.threshold : 0;
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => callback(entry.target, entry.isIntersecting && entry.intersectionRatio >= minRatio)),
    options,
  );
  targets.forEach((target) => observer.observe(target));
}
