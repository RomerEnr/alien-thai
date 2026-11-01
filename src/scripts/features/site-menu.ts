import { query, queryAll } from '../lib/dom';

const OPEN_CLASS = 'menu-open';
/** Lets the overlay start fading in before focus moves into it. */
const FOCUS_DELAY_MS = 60;

/** Fullscreen menu: Esc closes it, focus stays trapped inside while it is open. */
export function initSiteMenu(): void {
  const toggle = query<HTMLButtonElement>('[data-menu-toggle]');
  const menu = query('[data-menu]');
  if (!toggle || !menu) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const focusables = () => [toggle, ...queryAll('a', menu)];

  const setOpen = (open: boolean) => {
    document.body.classList.toggle(OPEN_CLASS, open);
    document.body.style.overflow = open ? 'hidden' : '';
    menu.setAttribute('aria-hidden', String(!open));
    updateToggle(toggle, open);
    setBackgroundInert(open);
    if (open) setTimeout(() => query('a', menu)?.focus(), FOCUS_DELAY_MS);
    else toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });
  addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') setOpen(false);
    else if (event.key === 'Tab') trapFocus(event, focusables());
  });
}

function updateToggle(toggle: HTMLButtonElement, open: boolean): void {
  const { labelOpen, labelClose, srOpen, srClose } = toggle.dataset;
  toggle.setAttribute('aria-expanded', String(open));
  query('[data-menu-label]', toggle)!.textContent = (open ? labelClose : labelOpen) ?? '';
  query('[data-menu-sr-label]', toggle)!.textContent = (open ? srClose : srOpen) ?? '';
}

/** Everything behind the overlay stops taking focus and clicks. */
function setBackgroundInert(inert: boolean): void {
  queryAll('main, [data-menu-inert]').forEach((element) => (element.inert = inert));
}

/** Wraps Tab and Shift+Tab around the ends of `focusables`. */
function trapFocus(event: KeyboardEvent, focusables: HTMLElement[]): void {
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
