import { query } from '../lib/dom';
import { onScrollFrame } from '../lib/frame';

/** Scroll distance after which the header turns solid. */
const SOLID_AFTER_PX = 40;

export function initSiteHeader(): void {
  const header = query('[data-site-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-solid', scrollY > SOLID_AFTER_PX);
  onScrollFrame(update);
  update();
}
