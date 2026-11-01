import { queryAll } from '../lib/dom';
import { clamp01 } from '../lib/math';
import { addScrollEffect } from '../lib/scroll-effects';

/** Each line starts this much later in the heading's rise than the one above it. */
const LINE_LAG = 0.3;
/** Share of the viewport the heading travels while its lines rise. */
const RISE_SPAN = 0.3;

/** Script version of the scroll-timeline rise in SplitHeading.astro. */
export function initHeadingRiseFallback(): void {
  const headings = queryAll('[data-split-heading="scroll"]');
  addScrollEffect(() => headings.forEach(paintHeading));
}

function paintHeading(heading: HTMLElement): void {
  const top = heading.getBoundingClientRect().top;
  if (top > innerHeight * 1.2 || top < -innerHeight) return;
  queryAll('.line > span', heading).forEach((line, i) => {
    const progress = clamp01((innerHeight - top) / (innerHeight * RISE_SPAN) - i * LINE_LAG);
    line.style.translate = `0 ${(1 - progress) * 105}%`;
  });
}
