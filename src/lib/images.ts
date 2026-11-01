import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export type ImageFormat = 'avif' | 'webp';

/** Per-format quality: AVIF holds detail at a much lower setting than WebP. */
const QUALITY: Record<ImageFormat, number> = { avif: 58, webp: 80 };

/** Modern first, so the browser takes the first one it understands. */
export const FORMATS: readonly ImageFormat[] = ['avif', 'webp'];

const MIME: Record<ImageFormat, string> = { avif: 'image/avif', webp: 'image/webp' };

export interface Source {
  type: string;
  srcset: string;
  media?: string;
  /** Intrinsic size, so art-directed crops reserve the right box. */
  width: number;
  height: number;
}

export interface Fallback {
  src: string;
  width: number;
  height: number;
}

/** Widths never exceed the source, so nothing is upscaled. */
const fitWidths = (image: ImageMetadata, widths: readonly number[]) => {
  const fitting = widths.filter((w) => w <= image.width);
  return fitting.length ? fitting : [image.width];
};

export async function buildSource(
  image: ImageMetadata,
  widths: readonly number[],
  format: ImageFormat,
  media?: string,
): Promise<Source> {
  const result = await getImage({ src: image, widths: fitWidths(image, widths), format, quality: QUALITY[format] });
  return { type: MIME[format], srcset: result.srcSet.attribute, media, width: image.width, height: image.height };
}

/** One <source> per format, optionally scoped to a media query. */
export const buildSources = (image: ImageMetadata, widths: readonly number[], media?: string) =>
  Promise.all(FORMATS.map((format) => buildSource(image, widths, format, media)));

/** The <img> itself: WebP at a middle width, for browsers without <picture> support. */
export async function buildFallback(image: ImageMetadata, widths: readonly number[]): Promise<Fallback> {
  const fitting = fitWidths(image, widths);
  const width = fitting[Math.floor((fitting.length - 1) / 2)];
  const result = await getImage({ src: image, width, format: 'webp', quality: QUALITY.webp });
  return { src: result.src, width, height: Math.round((image.height / image.width) * width) };
}
