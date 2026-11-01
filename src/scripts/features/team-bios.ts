import { queryAll } from '../lib/dom';

const OPEN_CLASS = 'is-open';

/** A tap or Enter opens a teacher's bio and closes any other (hover does it on desktop). */
export function initTeamBios(): void {
  const members = queryAll('[data-team-member]');
  members.forEach((member) =>
    member.querySelector('[data-bio-toggle]')?.addEventListener('click', () => {
      const open = !member.classList.contains(OPEN_CLASS);
      members.forEach((other) => setOpen(other, false));
      setOpen(member, open);
    }),
  );
}

function setOpen(member: HTMLElement, open: boolean): void {
  member.classList.toggle(OPEN_CLASS, open);
  member.querySelector('[data-bio-toggle]')?.setAttribute('aria-expanded', String(open));
}
