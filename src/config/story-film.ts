import type { ArtDirection } from '@/lib/art-direction';
import posterLandscape from '@/assets/images/story/poster-landscape.png';
import posterPortrait from '@/assets/images/story/poster-portrait.png';
import stillLandscape from '@/assets/images/story/still-landscape.png';
import stillPortrait from '@/assets/images/story/still-portrait.png';
import { publicUrl } from '@/lib/urls';
import { MEDIA } from './media';

/**
 * The film is real footage from Mizzian's reels, black and white, no audio;
 * scroll drives its time. Tablets and phones get the vertical cut. The poster
 * is its first frame; with reduced motion the film never plays, so a still
 * from the gym shot stands in for it.
 */
export const STORY_FILM = {
  clips: {
    landscape: publicUrl('/media/video/story-landscape.mp4'),
    portrait: publicUrl('/media/video/story-portrait.mp4'),
  },
  /** Second at which the gym shot begins; it lands as the last chapter is read. */
  cutAt: 7.4,
} as const;

const WIDTHS = [720];

/** First match wins, so the most specific crops come first. */
export const STORY_FILM_ART: readonly ArtDirection[] = [
  { media: `${MEDIA.uptoTablet} and ${MEDIA.reducedMotion}`, image: stillPortrait, widths: WIDTHS },
  { media: MEDIA.uptoTablet, image: posterPortrait, widths: WIDTHS },
  { media: MEDIA.reducedMotion, image: stillLandscape, widths: WIDTHS },
  { media: 'all', image: posterLandscape, widths: WIDTHS },
];

export const STORY_FILM_SIZES = '(max-width: 860px) 100vw, 42vw';
