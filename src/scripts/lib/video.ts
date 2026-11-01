/**
 * A blob URL for the clip, so it is seekable even where the server ignores
 * range requests. Falls back to the plain URL if the download fails.
 */
export async function fetchSeekableSource(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return URL.createObjectURL(await response.blob());
  } catch {
    return url;
  }
}

/** WebKit never loads a preload="none" video it isn't asked to play, so ask for it all. */
export function attachSource(video: HTMLVideoElement, src: string): void {
  video.muted = true;
  video.preload = 'auto';
  video.src = src;
}

/** iOS paints a muted video's seeked frames only after it has played once. */
export function primeOnFirstTouch(video: HTMLVideoElement): void {
  const prime = () => video.play().then(() => video.pause(), () => {});
  addEventListener('touchstart', prime, { once: true, passive: true });
}
