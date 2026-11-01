import { query } from '../lib/dom';
import { clamp01 } from '../lib/math';
import { addScrollEffect } from '../lib/scroll-effects';

/** Script version of the hero photo's scroll-timeline drift in HeroSection.astro. */
export function initHeroDriftFallback(): void {
  const photo = query('[data-hero-photo]');
  if (!photo) return;
  addScrollEffect(() => {
    const progress = clamp01(scrollY / innerHeight);
    photo.style.scale = String(1 + 0.08 * progress);
    photo.style.translate = `0 ${-3 * progress}%`;
  });
}
