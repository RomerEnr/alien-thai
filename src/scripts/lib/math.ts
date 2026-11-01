export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const clamp01 = (value: number) => clamp(value, 0, 1);

/** A value scattered ±spread around its base, e.g. jitter(700, .2) → 560…840. */
export const jitter = (base: number, spread: number) => base * (1 - spread + Math.random() * spread * 2);
