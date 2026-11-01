import { onScrollFrame } from './frame';

type Paint = () => void;

const painters: Paint[] = [];

/**
 * Registers a scroll-linked paint for browsers without CSS scroll timelines.
 * All painters share a single scroll listener and run once per frame.
 */
export function addScrollEffect(paint: Paint): void {
  if (painters.length === 0) onScrollFrame(() => painters.forEach((p) => p()));
  painters.push(paint);
  paint();
}

/** 0 when `element`'s top sits at the bottom of the viewport, rising as it scrolls up. */
export const viewportEntry = (element: Element) => (innerHeight - element.getBoundingClientRect().top) / innerHeight;
