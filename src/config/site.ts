/** Site-wide facts: the single source for anything repeated across sections. */
export const SITE = {
  name: 'Alien Thai',
  title: 'Alien Thai: Muay Thai en Tegueste',
  description:
    'Alien Thai, el gimnasio de Muay Thai de Mizzian en Tegueste, Tenerife. Un mundo aparte. Reserva tu clase de prueba.',
  lang: 'es',
  /** Off while the site is a preview for feedback on GitHub Pages; turn on at launch. */
  indexable: false,
  locale: 'es_ES',
  themeColor: '#0f100a',
  address: { street: 'Camino Viejo 56', postalCode: '38280', town: 'Tegueste', island: 'Tenerife' },
  /** Not public yet: contact and footer show it only once it is set. */
  phone: null as string | null,
  areas: ['Tegueste', 'Tejina', 'Bajamar', 'La Punta', 'Valle Guerra'],
  instagram: 'alienthai_',
  /** The discipline whose timetable the hero strip summarises. */
  headlineDiscipline: 'muay-thai',
  currency: '€',
} as const;

/** Until a Horarios section exists, the timetable and booking links lead to Contacto. */
const TIMETABLE_HREF = '#contacto';

export const CTA = {
  trialClass: { label: 'Clase de prueba', href: '#contacto' },
  book: { label: 'Reserva tu clase de prueba', href: '#contacto' },
  timetable: { label: 'Ver horarios', href: TIMETABLE_HREF },
} as const;

/** Menu order. Horarios and Veladas are still to be built. */
export const NAV_LINKS = [
  { label: 'Clases', href: '#clases' },
  { label: 'Horarios', href: TIMETABLE_HREF },
  { label: 'Precios', href: '#precios' },
  { label: 'Historia', href: '#historia' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Veladas', href: '#veladas' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/** Footer index of the page's sections, in page order. */
export const FOOTER_LINKS = [
  { label: 'Disciplinas', href: '#clases' },
  { label: 'Precios', href: '#precios' },
  { label: 'Historia', href: '#historia' },
  { label: 'Los maestros', href: '#equipo' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/** Pages still to be written: listed in the footer, unlinked until they exist. */
export const LEGAL_PAGES = ['Aviso legal', 'Privacidad', 'Cookies'] as const;

export const CREDIT = { label: 'Romer Álvarez', href: 'https://romeralvarez.me/' } as const;

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;

/** Google Maps directions to the gym, from its full postal address. */
export const directionsUrl = () => {
  const { street, postalCode, town } = SITE.address;
  const query = `${street}, ${postalCode} ${town}, Santa Cruz de Tenerife`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

/** "tel:" target for a phone written with spaces, e.g. "+34 600 000 000". */
export const telUrl = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
