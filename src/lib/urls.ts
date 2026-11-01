const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** A file in public/ under the site's base path (e.g. /alien-thai on GitHub Pages). */
export const publicUrl = (path: `/${string}`) => `${base}${path}`;
