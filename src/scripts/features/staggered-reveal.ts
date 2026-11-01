import { queryAll, wait } from '../lib/dom';
import { onceNear } from '../lib/observe';

/** Never hold a row back longer than this waiting for slow photos. */
const DECODE_TIMEOUT_MS = 2500;
const REVEALED_CLASS = 'is-revealed';

/** Reveals each [data-reveal] list once it nears the viewport and its photos are decoded (see styles/reveal.css). */
export function initStaggeredReveal(): void {
  queryAll('[data-reveal]').forEach((list) =>
    onceNear(list, () => revealWhenDecoded(list), { threshold: 0.15, rootMargin: '0px 0px 200px 0px' }),
  );
}

async function revealWhenDecoded(list: HTMLElement): Promise<void> {
  const images = queryAll<HTMLImageElement>('img', list);
  images.forEach((image) => (image.loading = 'eager'));
  await Promise.race([Promise.allSettled(images.map((image) => image.decode())), wait(DECODE_TIMEOUT_MS)]);
  requestAnimationFrame(() => list.classList.add(REVEALED_CLASS));
}
