import type { ImageMetadata } from 'astro';

/** One image of a <picture>, with the widths to generate for it. */
export interface Crop {
  image: ImageMetadata;
  widths: readonly number[];
  /** Shown while this media query matches; none means always. */
  media?: string;
}

/** One crop of an art-directed picture, shown while its media query matches. */
export interface ArtDirection extends Crop {
  media: string;
}
