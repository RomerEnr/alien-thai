import { MEDIA } from '@/config/media';
import { query, queryAll } from '../lib/dom';
import { jitter } from '../lib/math';
import { matches, prefersReducedMotion } from '../lib/media';
import { onceNear, watchVisibility } from '../lib/observe';
import { attachSource, fetchSeekableSource } from '../lib/video';

/** How far ahead of the row the clips start downloading. */
const PRELOAD_MARGIN = '600px 0px';
/** The rest between reps varies this much either way. */
const REST_JITTER = 0.2;
const PLAYING_CLASS = 'is-playing';

/**
 * A fighter's shadowboxing loop: plays only while on screen, at its own
 * speed, resting in the still's pose between reps (clips start and end on
 * it, so the rest hides the seam).
 */
class PlanClip {
  readonly figure: HTMLElement;
  private readonly video: HTMLVideoElement;
  private readonly playbackRate: number;
  private readonly restMs: number;
  private readonly startAt: number;
  private visible = false;
  private resting = 0;

  constructor(figure: HTMLElement) {
    this.figure = figure;
    this.video = query<HTMLVideoElement>('video', figure)!;
    const { playbackRate, restMs, startAt } = this.video.dataset;
    this.playbackRate = Number(playbackRate);
    this.restMs = Number(restMs);
    this.startAt = Number(startAt);
  }

  async load(): Promise<void> {
    const { video } = this;
    video.addEventListener('loadeddata', () => (video.currentTime = this.startAt * video.duration), { once: true });
    video.addEventListener('canplay', () => {
      video.defaultPlaybackRate = video.playbackRate = this.playbackRate;
      this.play();
    });
    video.addEventListener('playing', () => this.figure.classList.add(PLAYING_CLASS), { once: true });
    video.addEventListener('ended', () => this.rest());
    attachSource(video, await fetchSeekableSource(video.dataset.src!));
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    if (visible) this.play();
    else this.video.pause();
  }

  private play(): void {
    if (this.visible && !this.resting && this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      this.video.play().catch(() => {});
    }
  }

  private rest(): void {
    this.resting = window.setTimeout(() => {
      this.resting = 0;
      this.video.currentTime = 0;
      this.play();
    }, jitter(this.restMs, REST_JITTER));
  }
}

/**
 * Desktop only: phones, touch screens and reduced motion never download the
 * clips and keep the still fighters.
 */
export function initPlanClips(): void {
  const row = query('[data-plan-clips]');
  if (!row || matches(MEDIA.stillClips) || prefersReducedMotion()) return;

  const clips = queryAll('[data-plan-clip]', row).map((figure) => new PlanClip(figure));
  onceNear(row, () => clips.forEach((clip) => clip.load()), { rootMargin: PRELOAD_MARGIN });
  watchVisibility(
    clips.map((clip) => clip.figure),
    (figure, visible) => clips.find((clip) => clip.figure === figure)?.setVisible(visible),
  );
}
