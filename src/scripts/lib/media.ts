import { MEDIA } from '@/config/media';

export const matches = (mediaQuery: string) => matchMedia(mediaQuery).matches;

export const prefersReducedMotion = () => matches(MEDIA.reducedMotion);

/** Browsers without CSS scroll timelines get the scroll effects from script. */
export const needsScrollTimelineFallback = () =>
  !CSS.supports('animation-timeline: view()') && !prefersReducedMotion();
