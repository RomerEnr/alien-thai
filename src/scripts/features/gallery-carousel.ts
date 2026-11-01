import { query, queryAll } from '../lib/dom';
import { throttleToFrame } from '../lib/frame';
import { prefersReducedMotion } from '../lib/media';

/** The bar never looks empty, even at the start of the row. */
const MIN_PROGRESS = 0.12;
/** Scroll positions this close to an end count as the end. */
const END_TOLERANCE_PX = 4;
const CARDS_PER_STEP = 2;

/**
 * A sideways row with previous/next buttons and a progress bar that follow
 * its scroll. Without JS the row still scrolls natively.
 */
export function initGalleryCarousel(): void {
  const track = query('[data-carousel]');
  const bar = query('[data-carousel-progress]');
  const buttons = queryAll<HTMLButtonElement>('[data-carousel-step]');
  if (!track || !bar || buttons.length === 0) return;

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    bar.style.setProperty('--progress', progressOf(track).toFixed(3));
    buttons.forEach((button) => {
      const back = Number(button.dataset.carouselStep) < 0;
      button.disabled = back ? track.scrollLeft < END_TOLERANCE_PX : track.scrollLeft > max - END_TOLERANCE_PX;
    });
  };

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const direction = Number(button.dataset.carouselStep);
      track.scrollBy({
        left: direction * cardStep(track) * CARDS_PER_STEP,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }),
  );

  const syncOnFrame = throttleToFrame(sync);
  track.addEventListener('scroll', syncOnFrame, { passive: true });
  addEventListener('resize', syncOnFrame);
  sync();
}

/** Share of the row seen so far: what fits on screen, plus what has scrolled past. */
function progressOf(track: HTMLElement): number {
  const shown = track.clientWidth / track.scrollWidth;
  const max = track.scrollWidth - track.clientWidth;
  const scrolled = max > 0 ? track.scrollLeft / max : 1;
  return Math.max(MIN_PROGRESS, shown + scrolled * (1 - shown));
}

/** One card's width plus the gap after it. */
function cardStep(track: HTMLElement): number {
  const card = track.firstElementChild as HTMLElement;
  return card.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
}
