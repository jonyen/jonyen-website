# Zine Theme Redesign — Design Spec

**Date:** 2026-05-26
**Scope:** Theme-only rebuild of `jonyen.com`. Same routes, same sections, same copy. New visual language across all pages.

## Goals

Replace the current "editorial / gold-on-cream" theme with a polished zine aesthetic. The new theme should read as fun and playful while keeping professional credibility. Visual identity comes from riso-print color palette, mono micro-labels, sticker badges, and slight geometric rotations — not from heavy hand-drawn or torn-paper textures.

## Non-Goals

- Content changes (copy, photos, resume PDF, project descriptions).
- Route changes. `/`, `/travel`, `/portfolio`, `public/resume`, `public/schedule` all stay.
- Build or tooling migration. Stays on Create React App / React 19 / MUI 7.
- New runtime dependencies beyond fonts loaded via Google Fonts CSS `@import`.
- Automated visual regression tests.

## Visual Identity

### Palette — Light Mode

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#fdfdf7` | Page background, off-white riso paper |
| `--color-ink` | `#111111` | Body and display text |
| `--color-blue` | `#2563eb` | Primary spot color (links, mono labels, accent rules) |
| `--color-coral` | `#f87171` | Secondary spot color (stickers, hover states) |
| `--color-text-secondary` | `#555555` | Subdued body text |
| `--color-cream` | `#f5f1e6` | Card surface tint |
| `--color-border` | `rgba(17, 17, 17, 0.12)` | Hairline borders |

### Palette — Dark Mode (separate aesthetic)

Dark mode is a "midnight zine" mood, not a simple inversion.

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#0e1116` | Deep ink-blue paper |
| `--color-ink` | `#f4ede0` | Warm cream text |
| `--color-blue` | `#60a5fa` | Brighter cobalt for contrast |
| `--color-coral` | `#fb7185` | Warmer coral |
| `--color-cream` | `#161a22` | Card surface |
| `--color-text-secondary` | `#a8a39a` | Subdued body text |
| `--color-border` | `rgba(244, 237, 224, 0.12)` | Hairline borders |

### Typography

- **Display:** Inter Tight, weight 900, letter-spacing `-0.05em`, line-height `0.85` on tight headline stacks.
- **Body:** Inter, weights 400/500.
- **Mono labels:** IBM Plex Mono, weights 500/600, sizes 11–12px, letter-spacing `0.1em`–`0.15em`, generally uppercase.
- Fontshare imports for Clash Display and Satoshi are removed. Google Fonts `@import` replaces them.

### Shape and Texture

- `borderRadius` reduces from 12 to 4. Paper reads squarer.
- Existing CSS noise overlay at 0.015 opacity is kept.
- Buttons become hard rectangles with 2px solid ink border; primary CTA fills ink on paper and inverts on hover.
- Sticker rotations: ±4° to ±8°, stable per instance, randomized at mount.
- Card shadows shift from soft drop-shadow to hard offset shadow (`4px 4px 0 var(--color-ink)`).

## Component Primitives

All primitives live in `src/components/shared-theme/zine/`. Each is small, focused, and prop-driven.

### `<Sticker>`

Rotated badge with mono text.

- Props: `color` ('blue' | 'coral' | 'ink', default `'coral'`), `rotate` (number degrees, default randomized to ±6° per mount but stable for the instance), `border` (boolean, default true), `children`.
- Uses IBM Plex Mono, 10–11px, weight 700.
- Pop animation on entrance (scale `0.85`→`1.0` plus rotate from `0` to target over 400ms with overshoot easing).

### `<MonoLabel>`

Uppercase mono micro-label.

- Props: `color` (default `'var(--color-blue)'`), `prefix` (string, optional, e.g. `★`, `→`, `· `), `children`.
- Pairs with `<AccentRule>` for section eyebrows.

### `<AccentRule>`

Horizontal 2px line.

- Props: `color`, `width` (default `48px`).
- Animates via existing `drawLine` keyframe.

### `<MastheadBar>`

Top strip of mono text used at the start of every page.

- Props: `left` (string), `right` (string).
- Renders both in IBM Plex Mono. Adapts to single-line on xs.

### `<StampCard>`

Paper card with hard border. Used for Experience entries, Portfolio items, Travel stamps, FunFact items, and Calendly embed.

- Props: `rotate` (number degrees, default 0), `tape` (boolean, default false — adds a small angled tape corner), `children`.
- Hard 2px ink border. Hard offset shadow. Tape decoration is a small rotated `<Box>` with semi-transparent warm color.

### Animations

Added to `src/index.css`:

- `pop`: scale and rotate-in. 400ms `cubic-bezier(0.34, 1.56, 0.64, 1)`. Used by `<Sticker>`.
- `typewriter`: clip-path inset reveal. 600ms `steps(20)`. Used optionally on `<MonoLabel>` when entering viewport.

Existing keyframes kept: `fadeInUp`, `fadeIn`, `slideInFromLeft`, `scaleIn`, `drawLine`, `shimmer`, `float`.

## Landing Page Sections

Same content as today. New treatment.

### `Header.js`

- Logo `JY` in Inter Tight 900.
- Nav items rendered as mono uppercase with a numeric prefix matching the section number (`01 ABOUT`, `02 EXPERIENCE`, etc.).
- Scrolled state uses a hard 2px ink bottom border instead of soft border + heavy backdrop blur (light blur kept).
- Social icons remain but use outline-only MUI icons. Hover color is coral.
- `<ColorModeIconDropdown>` is kept; styling updated to outline mono icon button consistent with header.

### `Hero.js`

- Drop the gold radial blobs and the floating animations on them.
- Top of section: `<MastheadBar left="VOL.04 · EST. 2009" right="DC METRO" />`.
- Existing `Washington DC Metro` pill becomes `<MonoLabel prefix="●">AVAILABLE · DC METRO</MonoLabel>`; the existing green-dot pulse is preserved.
- Profile image keeps the circular crop. Border becomes 2px solid ink. Drop shadow becomes hard offset `4px 4px 0 var(--color-ink)`.
- Name is Inter Tight 900, two-line stack with line-height 0.85.
- Subtitle row: `<AccentRule color="blue" />` followed by `<MonoLabel>FULL STACK ENGINEER</MonoLabel>`.
- Blurb in Inter body at max-width 480px.
- CTA: ink-filled rectangle with mono text `EXPLORE ↓`. Hover inverts (paper text on ink, or ink text on cream depending on dark mode).
- Decorative `<Sticker color="coral" rotate={8}>★ NEW ★</Sticker>` positioned top-right of the hero block.

### `About.js`

- Section eyebrow: `<MonoLabel prefix="01 —">ABOUT</MonoLabel>`.
- Heading in Inter Tight 900.
- Body in two columns at md+, single column at xs.
- Decorative `<Sticker color="blue" rotate={-3}>HELLO</Sticker>` placed top-left of the content block.

### `Experience.js`

- Section eyebrow: `<MonoLabel prefix="02 —">EXPERIENCE</MonoLabel>`.
- Each role becomes a `<StampCard>` with rotation in `[-2, -1, 1, 2]` (cycling, stable per index) and `tape` on alternating cards.
- Card contents: company logo (smaller, with hard border, no soft shadow), company name in Inter Tight 700, role in Inter Tight 600, date range in mono, bullets in Inter body.
- Cards alternate left/right horizontal offset at md+ (roughly ±32px from center), stacked full-width at xs.

### `Portfolio.js` (landing-page section)

- Section eyebrow: `<MonoLabel prefix="03 —">PORTFOLIO</MonoLabel>`.
- Grid of `<StampCard>` items: project thumbnail, title in Inter Tight 700, body, mono labels for tech stack, mono `→ VIEW` link.
- Footer link `VIEW ALL →` (mono, coral) routes to `/portfolio`.

### `FunFacts.js`

- Section eyebrow: `<MonoLabel prefix="04 —">FUN FACTS</MonoLabel>`.
- Each fact renders as a `<StampCard>` in a scrapbook grid: rotations `[-4, 2, -1, 5]` cycling, mixed tape decorations on some.
- The existing Duolingo streak fact (fetched from the public Duolingo API) gets an attached `<Sticker color="coral">★ {streak}d ★</Sticker>`. If the API request fails, the sticker is omitted.

### `Contact.js`

- Section eyebrow: `<MonoLabel prefix="05 —">CONTACT</MonoLabel>`.
- The Calendly embed is wrapped in `<StampCard tape>`, retaining the existing `react-calendly` component.
- Social links render as a vertical list of mono text rows: `→ GITHUB`, `→ LINKEDIN`, `→ RESUME`, `→ SCHEDULE`. Hover state: coral underline draws in using `drawLine`.

### `Footer.js`

- Single centered mono row: `© 2026 JONATHAN YEN · PRINTED IN 2 INKS · NO.21`.
- The volume and issue values match what `<MastheadBar>` uses on the landing hero.

## `/travel` Page

`TravelPage.js`:
- `<MastheadBar left="FIELD NOTES · TRAVEL" right="JONATHAN YEN" />`.
- Title in Inter Tight 900: `PASSPORT`.
- `<MonoLabel prefix="●">COUNTRIES VISITED · {count}</MonoLabel>`.

`PassportHeader.js`:
- Existing passport-cover gradient is removed.
- Rebuilt as an ink-on-cream `<StampCard>` containing fields like `PASSPORT NO.`, `NAME`, `NATIONALITY` rendered with mono labels and Inter Tight values.

`WorldMap.js`:
- `react-simple-maps` is kept. Country fills change to the riso palette:
  - Sea/background: `var(--color-paper)`.
  - Visited: `var(--color-blue)`.
  - Unvisited: `var(--color-paper)` fill with ink hairline stroke.
  - Border stroke: `var(--color-ink)`.
  - Hover: coral outline 2px.
- Tooltip styling switches to mono labels on paper background with ink border.

`CountryStamps.js`:
- Each visited country becomes a `<StampCard tape>` with rotation in `[-4, -2, 2, 4]` cycling.
- Country name in Inter Tight 900. Date and city in mono. Flag emoji rendered inside a coral `<Sticker>` corner.

## `/portfolio` Page

`PortfolioPage.js`:
- `<MastheadBar left="WORK · PORTFOLIO" right="JONATHAN YEN" />`.
- Title: `SELECTED WORK` in Inter Tight 900.
- `<MonoLabel prefix="01 —">PROJECTS</MonoLabel>`.
- Grid of `<StampCard>` items matching the landing-page `Portfolio.js` treatment, with one or two extra fields per project (role, year, link).
- `← BACK` mono link at top-left routes to `/`.

## Theme Module Changes

`themePrimitives.js`:
- Replace `brand`/`gray` palette objects with the riso palette tokens.
- `typography.fontFamily` becomes `"'Inter', -apple-system, BlinkMacSystemFont, sans-serif"`.
- All `h1`–`h6` switch to `"'Inter Tight', sans-serif"`, weight 900 on h1/h2, 700 on h3/h4, 600 on h5/h6.
- `shape.borderRadius` becomes 4.
- `colorSchemes.light` and `colorSchemes.dark` adopt the new palettes from the Visual Identity section.
- The existing `mode === 'dark'` branches inside `getDesignTokens` update to use the new dark palette.

`themePrimitives.ts`:
- If unreferenced (grep confirms), delete it. Otherwise mirror the `.js` changes.

`index.css`:
- Replace the CSS variable block at `:root` and the `[data-mui-color-scheme="dark"]` override.
- Swap the Fontshare `@import` for a Google Fonts `@import` covering Inter Tight, Inter, and IBM Plex Mono.
- Add `pop` and `typewriter` keyframes.
- Remove gold-related selection and scrollbar tints; selection becomes blue spot, scrollbar thumb becomes ink.

`AppTheme.js`:
- No structural change. Still wraps children in MUI `ThemeProvider`.

## Removed Patterns

- `--color-gold`, `--color-gold-dim`, `--color-navy`, `--color-navy-light` CSS variables.
- Clash Display and Satoshi font imports and references.
- Gold radial blob decorations and their `float` usages in `Hero.js`.
- Soft `boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'` patterns — replaced with hard offset shadows.

## Implementation Order

1. Theme tokens: `src/index.css` and `src/components/shared-theme/themePrimitives.js`. After this step the site renders in the new palette and fonts but with old layout primitives — visible mid-transition state, expected.
2. Zine primitives: create the five components under `src/components/shared-theme/zine/` plus an `index.js` re-export.
3. `Header.js` and `Hero.js`.
4. `About.js`, `Experience.js`, `Portfolio.js`, `FunFacts.js`, `Contact.js`, `Footer.js`.
5. `/travel` route: `TravelPage.js`, `PassportHeader.js`, `WorldMap.js`, `CountryStamps.js`.
6. `/portfolio` route: `PortfolioPage.js`.

The work can land as a single PR or be split per step. Splitting per step is preferred for review legibility; this is decided at plan time.

## Verification

- `npm start`, walk `/`, `/travel`, `/portfolio` in light mode and dark mode.
- Confirm mobile drawer renders the mono nav with numeric prefixes correctly.
- Confirm the Calendly embed contrasts correctly against the new paper background in both modes.
- Confirm `WorldMap` renders correctly with the riso palette and that hover/tooltip interactions still work.
- Grep should return zero hits for the removed tokens in `src/`:
  ```
  grep -r "color-gold\|color-navy\|Clash Display\|Satoshi" src/
  ```
- No automated visual tests are added. Manual smoke per route is the verification standard, consistent with the current codebase.

## Open Questions Resolved During Brainstorming

- Personality: polished zine (not Memphis, claymorphic, or arcade).
- Palette: riso duotone — cobalt blue + coral red on off-white paper.
- Typography: sans-only — Inter Tight + Inter + IBM Plex Mono.
- Dark mode: kept with a separate "midnight zine" aesthetic, not a straight inversion.
- Hero treatment: editorial-with-stickers, not full magazine-cover masthead.
- Travel and Portfolio pages: full zine reskin, not theme-token-only inheritance.
- Animation: keep current fade-up + drawLine + float, add sticker pop and mono typewriter reveal.
