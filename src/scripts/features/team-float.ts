import { MEDIA } from '@/config/media';
import { query, queryAll } from '../lib/dom';
import { clamp01 } from '../lib/math';
import { matches } from '../lib/media';
import { addScrollEffect } from '../lib/scroll-effects';

/** Each card floats this much further than the one before it (px). */
const FLOAT_STEP = 26;

/** Script version of the team row's scroll-timeline float in TeamSection.astro. */
export function initTeamFloatFallback(): void {
  const row = query('[data-team]');
  if (!row) return;
  const members = queryAll('[data-team-member]', row);
  addScrollEffect(() => {
    const { top, height } = row.getBoundingClientRect();
    const progress = clamp01((innerHeight - top) / (innerHeight + height));
    const wide = matches(MEDIA.fromLaptop);
    members.forEach((member, i) => {
      member.style.translate = wide ? `0 ${i * FLOAT_STEP * (1 - 2 * progress)}px` : '';
    });
  });
}
