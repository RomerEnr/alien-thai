import { queryAll } from '../lib/dom';
import { watchVisibility } from '../lib/observe';

const CURRENT_CLASS = 'is-current';
/** A chapter counts as being read while it crosses the middle third of the screen. */
const READING_BAND = '-35% 0px -35% 0px';

/** Lights the numeral of the chapter being read. */
export function initStoryChapters(): void {
  watchVisibility(
    queryAll('[data-story-chapter]'),
    (chapter, reading) => chapter.classList.toggle(CURRENT_CLASS, reading),
    { rootMargin: READING_BAND },
  );
}
