const TRAILING_MARK = /([.,;:!?])$/;

/** Splits "aparte." into ["aparte", "."] so the mark can take the accent colour. */
export function splitTrailingMark(line: string): { text: string; mark: string } {
  const match = line.match(TRAILING_MARK);
  return match ? { text: line.slice(0, -1), mark: match[1] } : { text: line, mark: '' };
}

/** "Lun", "Mié", "Vie" → "Lun · Mié · Vie" */
export const joinWithDots = (parts: readonly string[]) => parts.join(' · ');

const thaiDigits = new Intl.NumberFormat('th-TH-u-nu-thai');

/** 1 → "๑" */
export const toThaiNumeral = (value: number) => thaiDigits.format(value);

const spanishList = new Intl.ListFormat('es', { type: 'conjunction' });

/** ["A", "B", "C"] → "A, B y C" */
export const joinAsList = (items: readonly string[]) => spanishList.format(items);
