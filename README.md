# Alien Thai: web

Web de Alien Thai (Muay Thai en Tegueste), migrada a **Astro 7** desde la maqueta `~/Desktop/alien-thai-web` (al día con la v25: galería, contacto y footer).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias (Node ≥ 22) |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio estático en `dist/` (imágenes AVIF/WebP incluidas) |
| `npm run preview` | Sirve `dist/` en local |
| `npx astro check` | Comprobación de tipos de componentes y contenido |
| `npm run deploy` | Compila y publica en GitHub Pages (rama `gh-pages`) |
| `tools/encode-video.sh <preset> <entrada>` | Codifica un vídeo para la web (ver abajo) |

## Publicación

La vista previa vive en GitHub Pages: <https://romerenr.github.io/alien-thai/>. `npm run deploy` compila y sube `dist/` a la rama `gh-pages`, que Pages sirve tal cual. Mientras sea una vista previa, `SITE.indexable` está a `false` y la web lleva `noindex`. Con el dominio definitivo, define `SITE_URL` y `BASE_PATH` (ver `astro.config.mjs`) y activa `SITE.indexable`.

## Estructura

```text
src/
├── pages/index.astro        Ensambla las secciones; no lleva lógica
├── layouts/BaseLayout.astro <head>, fuentes, cabecera, menú y <main>
├── components/
│   ├── sections/            Una sección de la página por archivo
│   ├── layout/              Section, SectionIntro, cabecera, menú, skip link
│   ├── ui/                  Piezas genéricas (Button, TextLink, SplitHeading…)
│   ├── media/               ResponsivePicture (dirección de arte) y preloads
│   └── hero|disciplines|pricing|story|team|gallery|contact|footer|brand/   Piezas de cada sección
├── content/                 Textos editables (Markdown/YAML) validados por esquema
├── content.config.ts        Esquemas de las colecciones
├── config/                  Copys fijos, datos del sitio, recortes y rutas de medios
├── lib/                     Funciones puras usadas en build (texto, imágenes, contenido)
├── scripts/
│   ├── features/            Un comportamiento por archivo, con su init*()
│   └── lib/                 Utilidades de DOM, frames y matemáticas
├── styles/                  Tokens, reset, utilidades y breakpoints (custom media)
└── assets/images/           Originales; Astro genera AVIF/WebP en build
public/media/video/          Vídeos ya codificados (no los procesa Astro)
tools/                       Scripts de mantenimiento
```

## Convenciones

- **Contenido fuera del código.** Disciplinas, capítulos de la historia, equipo, precios y galería viven en `src/content/`; dirección, teléfono y enlaces, en `src/config/site.ts`. Para cambiar un texto o un precio no hace falta tocar componentes.
- **Componentes pequeños.** Cada sección compone piezas de su carpeta y de `ui/`. Los estilos son *scoped*; los genéricos usan `:where()` para no ganar en especificidad.
- **Breakpoints con nombre.** Se usan `@media (--upto-phone)`, `(--from-laptop)`, etc., definidos en `src/styles/custom-media.css`.
- **JS progresivo.** Cada efecto en `scripts/features/` se activa solo si hay soporte (`scroll-timeline`, `prefers-reduced-motion`…) y la página funciona sin él.
- **Imágenes.** Siempre con `ResponsivePicture` o `<Picture>` de Astro (AVIF + WebP, `srcset`, dirección de arte móvil/escritorio). La imagen LCP del hero se precarga.

## Vídeos

Los vídeos van en H.264, sin audio, con `faststart` y GOP corto para que el scrub con scroll vaya fino. Para regenerarlos desde un máster:

```bash
tools/encode-video.sh story-landscape historia-master.mp4
tools/encode-video.sh story-portrait  historia-master-vertical.mp4
tools/encode-video.sh plan            precios/clips/kick.mp4   # → plan-kick.mp4
tools/encode-video.sh gallery         clips/room.mp4           # → gallery-room.mp4
```

| Preset | Tamaño | crf | GOP |
|---|---|---|---|
| `story-landscape` | 720×960 | 23 | 8 |
| `story-portrait` | 540×960 | 26 | 4 |
| `plan` | 480×640 | 27 | 6 |
| `gallery` | 540×676 | 27 | 48 |

## Imagen para compartir

La tarjeta que sale al compartir el enlace (Open Graph y X) está en `src/assets/images/social/share.webp` y la monta `SocialMeta.astro`, que la sirve en JPG a 1200×630 con URL absoluta. Se compone desde el hero con las fuentes de la web:

```bash
npm run build && python3 tools/make-share-image.py
```

## Pendiente antes de publicar

- La imagen del hero, el plano del gimnasio de la historia y los clips de precios están **generados con IA**: Mizzian debe aprobarlos.
- **Teléfono:** no se muestra. Al ponerlo en `SITE.phone` (`src/config/site.ts`) aparece en el contacto y en el footer.
- **Galería:** salen alumnos y Hecher Sosa. El gimnasio debe confirmar que tiene su permiso (y el de los tutores de cualquier menor).
- Aviso legal, Privacidad y Cookies aparecen en el footer sin enlace hasta que existan esas páginas.
