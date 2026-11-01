/**
 * Section copy. Headings are split into the lines they break on; a trailing
 * punctuation mark is drawn in the accent colour (see lib/text.ts).
 */
export const HERO_COPY = {
  heading: ['Un mundo', 'aparte.'],
  lede: { lead: 'Muay Thai en Tegueste.', body: 'Da igual quién seas, tu condición o tu nivel. Aquí no hace falta ser un tipo duro.' },
  image: { alt: 'Mizzian entrenando frente al mural del gimnasio' },
} as const;

export const MENU_COPY = {
  image: { alt: 'Alien azul del mural del gimnasio' },
  welcome: 'Un rollo distinto, alienígena. Pueden considerar este sitio su casa.',
} as const;

export const DISCIPLINES_COPY = {
  heading: ['Tres artes,', 'un mundo'],
  lede: 'Muay Thai, jiu-jitsu brasileño y capoeira bajo el mismo techo. Para todo tipo de personas y niveles.',
} as const;

export const PRICING_COPY = {
  heading: ['Elige tu', 'asalto.'],
  lede: 'Cuota al mes o bonos de clases, como mejor te encaje. Empieza por una clase de prueba.',
} as const;

export const STORY_COPY = {
  heading: ['Salir de la', 'oscuridad.'],
  closing: {
    quote: 'No me arrepiento de nada de lo que ha pasado, porque he aprendido de todas esas malas decisiones.',
    attribution: 'Mizzian, fundador de Alien Thai',
  },
} as const;

export const TEAM_COPY = {
  heading: ['Los', 'maestros.'],
  lede: 'Cada uno enseña lo que lleva media vida practicando.',
} as const;

export const GALLERY_COPY = {
  heading: ['Dentro', 'del gym.'],
  lede: 'Seminarios, entrenos y la gente que suda aquí cada semana.',
  listLabel: 'Fotos y vídeos del gimnasio',
  previous: 'Anterior',
  next: 'Siguiente',
  more: { title: ['Más en', 'Instagram'] },
} as const;

export const CONTACT_COPY = {
  heading: ['Dónde', 'estamos.'],
  lede: 'Ven a probar una clase. Escríbenos antes y te decimos a qué hora.',
  facts: { address: 'Dónde', phone: 'Teléfono', instagram: 'Instagram' },
  directions: 'Cómo llegar',
  writeUs: 'Escríbenos por Instagram',
  map: {
    alt: 'Mapa de Tegueste con Alien Thai marcado en el Camino Viejo 56',
    attribution: { label: 'OpenStreetMap', href: 'https://www.openstreetmap.org/copyright', suffix: 'contributors' },
  },
} as const;

export const FOOTER_COPY = {
  homeLabel: 'Alien Thai, volver arriba',
  sectionsLabel: 'Secciones',
  teachersLabel: 'Disciplinas y maestros',
  follow: 'Síguenos',
  contact: 'Contacto',
  legalLabel: 'Legal (páginas en preparación)',
  credit: 'Web:',
} as const;

export const PLACEHOLDER_COPY = {
  phone: '[Teléfono]',
  days: 'Días',
  hours: 'horas por confirmar',
} as const;

export const MENU_TOGGLE_COPY = {
  open: { label: 'Menú', srLabel: 'Abrir menú' },
  close: { label: 'Cerrar', srLabel: 'Cerrar menú' },
} as const;

export const NEW_TAB_NOTE = 'se abre en otra pestaña';

export const TEAM_CARD_COPY = {
  bioToggle: (name: string) => `Bio de ${name}`,
} as const;
