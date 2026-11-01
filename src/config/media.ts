/** Media queries shared by scripts and markup. Keep in sync with src/styles/custom-media.css. */
export const MEDIA = {
  uptoPhone: '(max-width: 700px)',
  fromPhone: '(min-width: 701px)',
  uptoTablet: '(max-width: 860px)',
  fromLaptop: '(min-width: 1101px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  /** Devices that keep the price aliens still: narrow screens and touch screens. */
  stillClips: '(max-width: 860px), (pointer: coarse)',
} as const;
