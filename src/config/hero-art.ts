import type { ArtDirection } from '@/lib/art-direction';
import heroLandscape from '@/assets/images/hero/hero-landscape.png';
import heroPortrait from '@/assets/images/hero/hero-portrait.png';
import { MEDIA } from './media';

/**
 * The hero scene, AI-generated from real frames of the mural and of Mizzian
 * (he must approve it before publishing). Phones get the 9:16 cut.
 */
export const HERO_ART: readonly ArtDirection[] = [
  { media: MEDIA.uptoPhone, image: heroPortrait, widths: [720, 1080, 1520] },
  { media: MEDIA.fromPhone, image: heroLandscape, widths: [1280, 1920, 2688] },
];

export const HERO_SIZES = '100vw';
