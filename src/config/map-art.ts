import type { ArtDirection } from '@/lib/art-direction';
import mapLandscape from '@/assets/images/contact/map-landscape.webp';
import mapPortrait from '@/assets/images/contact/map-portrait.webp';
import { MEDIA } from './media';

/**
 * Still maps made from OpenStreetMap tiles and darkened to the tatami, so no
 * third-party embed or cookie is needed. Both crops are centred on the gym's
 * door: CartoCiudad (IGN) portal 56, 28.521464, −16.341382, since OSM only
 * knows the street. The pin is drawn over the centre.
 */
export const MAP_ART: readonly ArtDirection[] = [
  { media: MEDIA.uptoPhone, image: mapPortrait, widths: [600, 1000] },
  { media: MEDIA.fromPhone, image: mapLandscape, widths: [1200, 1800, 2400] },
];

export const MAP_SIZES = '100vw';
