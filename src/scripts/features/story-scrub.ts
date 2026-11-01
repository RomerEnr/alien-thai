import { MEDIA } from '@/config/media';
import { listenOnce, query, queryAll } from '../lib/dom';
import { clamp, clamp01 } from '../lib/math';
import { prefersReducedMotion } from '../lib/media';
import { onceNear, watchVisibility } from '../lib/observe';
import { attachSource, fetchSeekableSource, primeOnFirstTouch } from '../lib/video';

/** How far ahead of the story the film starts downloading. */
const PRELOAD_MARGIN = '800px 0px';
/** Stop short of the last frame, which some browsers never paint. */
const END_MARGIN_S = 0.05;
/** Share of the remaining distance the playhead covers each frame. */
const EASING = 0.2;
/** Closer than this (s), the playhead snaps to its target. */
const SNAP_S = 0.004;
/** A new seek only goes out when the frame on screen is this far off (s). */
const SEEK_TOLERANCE_S = 0.01;
/** The gym shot lands when the last chapter crosses this line of the viewport. */
const CUT_LINE = 0.65;
/** The cut never lands at the very start or end of the scroll. */
const CUT_RANGE = [0.05, 0.95] as const;
const READY_CLASS = 'is-ready';

/**
 * Scroll drives the film's time. The clip is a blob so it is always
 * seekable, the playhead eases towards its target once per frame, and a new
 * seek only goes out once the last one has landed, which keeps phones fluid.
 */
class StoryScrub {
  private readonly portrait = matchMedia(MEDIA.uptoTablet);
  private readonly video: HTMLVideoElement;
  private readonly progressBar: HTMLElement | null;
  private readonly lastChapter: HTMLElement;
  private readonly cutAt: number;
  private playhead = 0;
  private active = false;
  private frame = 0;

  constructor(
    private readonly grid: HTMLElement,
    private readonly film: HTMLElement,
  ) {
    this.video = query<HTMLVideoElement>('video', film)!;
    this.progressBar = query('[data-story-progress]', film);
    this.lastChapter = queryAll('[data-story-chapter]', grid).at(-1)!;
    this.cutAt = Number(this.video.dataset.cutAt);
  }

  start(): void {
    onceNear(this.grid, () => this.load(), { rootMargin: PRELOAD_MARGIN });
    watchVisibility([this.grid], (_, visible) => {
      this.active = visible;
      this.requestTick();
    });
    addEventListener('scroll', () => this.requestTick(), { passive: true });
    this.video.addEventListener('seeked', () => this.requestTick());
    primeOnFirstTouch(this.video);
  }

  private async load(): Promise<void> {
    const { srcLandscape, srcPortrait } = this.video.dataset;
    const url = this.portrait.matches ? srcPortrait! : srcLandscape!;
    listenOnce(this.video, 'loadeddata', () => {
      listenOnce(this.video, 'seeked', () => this.film.classList.add(READY_CLASS));
      this.video.currentTime = this.playhead = this.targetTime();
    });
    attachSource(this.video, await fetchSeekableSource(url));
  }

  private requestTick(): void {
    if (this.active && !this.frame) this.frame = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    this.frame = 0;
    if (!this.video.duration) return;
    const target = this.targetTime();
    this.playhead += (target - this.playhead) * EASING;
    if (Math.abs(target - this.playhead) < SNAP_S) this.playhead = target;
    if (!this.video.seeking && Math.abs(this.video.currentTime - this.playhead) > SEEK_TOLERANCE_S) {
      this.video.currentTime = this.playhead;
    }
    if (this.playhead !== target) this.requestTick();
  }

  /**
   * 0 when the film pins, the end when the closing line is fully on screen.
   * The first shots stretch until the last chapter reaches the cut line,
   * the gym shot fills the rest.
   */
  private targetTime(): number {
    const gridTop = this.grid.getBoundingClientRect().top;
    const pinTop = parseFloat(getComputedStyle(this.film).top) || 0;
    const travel = this.grid.offsetHeight - (this.portrait.matches ? this.film.offsetHeight : innerHeight - pinTop);
    if (travel <= 0) return 0;

    const progress = clamp01((pinTop - gridTop) / travel);
    this.progressBar?.style.setProperty('--progress', progress.toFixed(3));

    const lastChapterTop = this.lastChapter.getBoundingClientRect().top;
    const cut = clamp((pinTop - innerHeight * CUT_LINE + lastChapterTop - gridTop) / travel, ...CUT_RANGE);
    const end = this.video.duration - END_MARGIN_S;
    return progress < cut
      ? (progress / cut) * this.cutAt
      : this.cutAt + ((progress - cut) / (1 - cut)) * (end - this.cutAt);
  }
}

/** Reduced motion keeps the still and never downloads the film. */
export function initStoryScrub(): void {
  const grid = query('[data-story]');
  const film = query('[data-story-film]');
  if (!grid || !film || prefersReducedMotion()) return;
  new StoryScrub(grid, film).start();
}
