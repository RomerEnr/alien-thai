import { MEDIA } from '@/config/media';
import { query, queryAll } from '../lib/dom';
import { matches, prefersReducedMotion } from '../lib/media';
import { onceNear, watchVisibility } from '../lib/observe';
import { attachSource } from '../lib/video';

/** A clip plays only while at least this share of its frame shows. */
const MIN_VISIBLE = 0.4;
const PLAYING_CLASS = 'is-playing';

/**
 * Desktop only: each clip downloads once its frame comes into view and loops
 * muted while it stays there. Phones, touch screens and reduced motion keep
 * the stills and never download a clip.
 */
export function initGalleryClips(): void {
  const figures = queryAll('[data-gallery-clip]');
  if (figures.length === 0 || matches(MEDIA.stillClips) || prefersReducedMotion()) return;

  const videoOf = (figure: Element) => query<HTMLVideoElement>('video', figure)!;
  const load = (figure: Element) => {
    const video = videoOf(figure);
    if (video.src) return;
    video.addEventListener('playing', () => figure.classList.add(PLAYING_CLASS), { once: true });
    attachSource(video, video.dataset.src!);
  };

  // The row clips its cards, so a frame only "nears" once it is on screen.
  figures.forEach((figure) => onceNear(figure, () => load(figure)));
  watchVisibility(
    figures,
    (figure, visible) => {
      const video = videoOf(figure);
      if (!visible) return video.pause();
      load(figure);
      video.play().catch(() => {});
    },
    { threshold: MIN_VISIBLE },
  );
}
