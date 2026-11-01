import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { publicUrl } from '@/lib/urls';

/** CSS object-position of a photo's subject, e.g. "50% 22%". */
const focus = z.string().regex(/^\d+% \d+%$/).default('50% 30%');

/** A video in public/media, resolved against the site's base path. */
const mediaPath = z
  .string()
  .startsWith('/media/')
  .transform((path) => publicUrl(path as `/${string}`));

const instagramHandle = z.string().regex(/^[\w.]+$/);

const teachers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/teachers' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      instagram: instagramHandle,
      order: z.number().int(),
      portrait: z.object({ src: image(), alt: z.string(), focus }),
    }),
});

const disciplines = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/disciplines' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().int(),
      teacher: reference('teachers'),
      /** How the discipline card introduces its teacher. */
      teacherTagline: z.string(),
      photo: z.object({ src: image(), alt: z.string(), focus }),
      schedule: z
        .object({
          days: z.array(z.string()).optional(),
          hours: z.array(z.string()).optional(),
        })
        .default({}),
    }),
});

const plans = defineCollection({
  loader: file('./src/content/plans.yaml'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().int(),
      price: z.number().positive(),
      per: z.string(),
      featured: z.boolean().default(false),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      fighter: z.object({ src: image(), alt: z.string(), focus }),
      /** Shadowboxing loop that takes over from the still on desktop. */
      clip: z.object({
        src: mediaPath,
        playbackRate: z.number().positive(),
        restMs: z.number().int().nonnegative(),
        startAt: z.number().min(0).max(1),
      }),
    }),
});

const story = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/story' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().int().positive(),
      /** The chapter's Thai numeral, rendered in 3D with the aliens' skin. */
      numeral: z.object({
        src: image(),
        /** Optical size: evens out glyphs whose cut is taller or wider than the rest. */
        scale: z.number().positive().default(1),
      }),
    }),
});

/** Stills and clips from the gym's own reels, 4:5 and darkly graded, never with sound. */
const gallery = defineCollection({
  loader: file('./src/content/gallery.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      /** Shown everywhere; where there is a clip, also its poster and the phones' only frame. */
      still: image(),
      alt: z.string(),
      /** Muted loop that takes over from the still on desktop. */
      clip: mediaPath.optional(),
    }),
});

export const collections = { teachers, disciplines, plans, story, gallery };
