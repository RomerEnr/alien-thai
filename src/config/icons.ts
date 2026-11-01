/** Inline icons: their viewBox and inner SVG, drawn in currentColor. */
export const ICONS = {
  arrow: {
    viewBox: '0 0 18 18',
    body: '<path d="M2 9h13M10 4l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  },
  'arrow-small': {
    viewBox: '0 0 14 14',
    body: '<path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  },
  'arrow-small-back': {
    viewBox: '0 0 14 14',
    body: '<path d="M13 7H2M6 3 2 7l4 4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  },
  instagram: {
    viewBox: '0 0 14 14',
    body:
      '<rect x="1.5" y="1.5" width="11" height="11" rx="3.2" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
      '<circle cx="7" cy="7" r="2.6" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
      '<circle cx="10.3" cy="3.7" r=".8" fill="currentColor"/>',
  },
  plus: {
    viewBox: '0 0 12 12',
    body: '<path d="M6 0v12M0 6h12" stroke="currentColor" stroke-width="1.5"/>',
  },
} as const;

export type IconName = keyof typeof ICONS;
