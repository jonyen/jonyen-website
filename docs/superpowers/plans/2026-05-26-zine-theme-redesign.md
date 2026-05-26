# Zine Theme Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing "editorial / gold-on-cream" theme of `jonyen.com` with a polished zine aesthetic — riso duotone palette, sans-only typography (Inter Tight + Inter + IBM Plex Mono), sticker badges, mono micro-labels, slight rotations, and a separate "midnight zine" aesthetic in dark mode.

**Architecture:** Approach 3 from the spec — new theme tokens plus a small set of reusable zine primitive components (`Sticker`, `MonoLabel`, `AccentRule`, `MastheadBar`, `StampCard`) consumed by every section of the existing pages. Same routes (`/`, `/travel`, `/portfolio`). Same copy. No new runtime dependencies beyond Google Fonts via CSS `@import`.

**Tech Stack:** React 19, Create React App, MUI 7, Emotion, react-router-dom, react-simple-maps, react-calendly. Existing CSS variables drive theming at the DOM level; MUI palette + typography drive component-level styling.

**Verification standard:** No automated visual tests exist in the project. Each task ends with a manual smoke check via `npm start` on the affected routes in both light and dark mode. The final task runs a grep that must return zero hits for the removed tokens. Frequent commits land between tasks so any regression is easy to bisect.

**Spec:** `docs/superpowers/specs/2026-05-26-zine-theme-redesign-design.md`.

---

## File Map

**New files (created in Task 3):**
- `src/components/shared-theme/zine/Sticker.js`
- `src/components/shared-theme/zine/MonoLabel.js`
- `src/components/shared-theme/zine/AccentRule.js`
- `src/components/shared-theme/zine/MastheadBar.js`
- `src/components/shared-theme/zine/StampCard.js`
- `src/components/shared-theme/zine/index.js`

**Modified files:**
- `src/index.css` — palette CSS vars, font `@import`, new keyframes
- `src/components/shared-theme/themePrimitives.js` — riso palette tokens, Inter Tight typography, `shape.borderRadius = 4`
- `src/components/shared-theme/themePrimitives.ts` — delete if unreferenced
- `src/components/shared-theme/ColorModeIconDropdown.js` — outline mono button style
- `src/components/blog/Blog.js` — no logic change (kept for completeness; no edit needed)
- `src/components/blog/components/Header.js`
- `src/components/blog/components/Hero.js`
- `src/components/blog/components/About.js`
- `src/components/blog/components/Experience.js`
- `src/components/blog/components/Portfolio.js`
- `src/components/blog/components/FunFacts.js`
- `src/components/blog/components/Contact.js`
- `src/components/blog/components/Footer.js`
- `src/components/travel/TravelPage.js`
- `src/components/travel/components/PassportHeader.js`
- `src/components/travel/components/WorldMap.js`
- `src/components/travel/components/CountryStamps.js`
- `src/components/portfolio/PortfolioPage.js`

The `customizations/` files under `shared-theme/` (`inputs.js`, `navigation.js`, `dataDisplay.js`, `feedback.js`, `surfaces.js`, `surfaces.ts`) import `gray`, `brand`, `red`, `green`, `orange` from `themePrimitives`. **Keep those export names** — Task 2 swaps the values, not the names, so the customizations keep working without edits.

---

### Task 1: Replace global CSS tokens

**Files:**
- Modify: `src/index.css` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@900&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root {
  /* Riso duotone palette — light */
  --color-paper: #fdfdf7;
  --color-ink: #111111;
  --color-blue: #2563eb;
  --color-coral: #f87171;
  --color-text-secondary: #555555;
  --color-cream: #f5f1e6;
  --color-border: rgba(17, 17, 17, 0.12);

  /* Typography */
  --font-display: 'Inter Tight', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;
  --space-2xl: 6rem;

  /* Transitions */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-mui-color-scheme="dark"] {
  /* Riso duotone palette — dark "midnight zine" */
  --color-paper: #0e1116;
  --color-ink: #f4ede0;
  --color-blue: #60a5fa;
  --color-coral: #fb7185;
  --color-cream: #161a22;
  --color-text-secondary: #a8a39a;
  --color-border: rgba(244, 237, 224, 0.12);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background-color: var(--color-paper);
  color: var(--color-ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-cream);
}

::-webkit-scrollbar-thumb {
  background: var(--color-ink);
  border-radius: 0;
}

/* Selection */
::selection {
  background: var(--color-blue);
  color: var(--color-paper);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes drawLine {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.85) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(var(--pop-rotate, 0deg));
  }
}

@keyframes typewriter {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* Utility classes for staggered animations */
.animate-in {
  animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
  opacity: 0;
}

.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.2s; }
.animate-delay-3 { animation-delay: 0.3s; }
.animate-delay-4 { animation-delay: 0.4s; }
.animate-delay-5 { animation-delay: 0.5s; }
.animate-delay-6 { animation-delay: 0.6s; }

/* Noise texture overlay */
.noise-overlay::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.015;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

code {
  font-family: var(--font-mono);
}
```

- [ ] **Step 2: Verify dev server boots**

Run: `npm start`
Expected: dev server starts on port 3000 with no compile errors. Site renders — colors will look broken because components still reference removed CSS vars like `--color-gold`. That is expected after this task; subsequent tasks fix the components.

Stop the dev server after confirming compile.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "theme: swap global CSS tokens to riso duotone palette and Inter fonts"
```

---

### Task 2: Replace MUI theme primitives

**Files:**
- Modify: `src/components/shared-theme/themePrimitives.js` (full rewrite)
- Delete: `src/components/shared-theme/themePrimitives.ts` (only if no imports reference it)

- [ ] **Step 1: Confirm `themePrimitives.ts` is unreferenced**

Run: `grep -rn "themePrimitives" src/ --include="*.js" --include="*.ts" --include="*.tsx"`
Expected: every match imports from `'./themePrimitives'` or `'../themePrimitives'` without the `.ts` extension. JavaScript module resolution picks the `.js` file first; the `.ts` file is dead code.

- [ ] **Step 2: Delete the unreferenced `.ts` twin**

```bash
git rm src/components/shared-theme/themePrimitives.ts
```

- [ ] **Step 3: Overwrite `themePrimitives.js`**

Replace the entire contents of `src/components/shared-theme/themePrimitives.js` with:

```js
import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

const customShadows = [...defaultTheme.shadows];

// Riso duotone palette — blue scale (replaces former gold-based `brand`)
export const brand = {
  50: 'hsl(217, 91%, 96%)',
  100: 'hsl(217, 91%, 90%)',
  200: 'hsl(217, 91%, 80%)',
  300: 'hsl(217, 91%, 70%)',
  400: 'hsl(217, 91%, 60%)', // #2563eb-ish
  500: 'hsl(217, 91%, 50%)',
  600: 'hsl(217, 91%, 40%)',
  700: 'hsl(217, 91%, 30%)',
  800: 'hsl(217, 91%, 22%)',
  900: 'hsl(217, 91%, 14%)',
};

// Ink-toned neutral scale
export const gray = {
  50: 'hsl(0, 0%, 98%)',
  100: 'hsl(0, 0%, 94%)',
  200: 'hsl(0, 0%, 88%)',
  300: 'hsl(0, 0%, 80%)',
  400: 'hsl(0, 0%, 60%)',
  500: 'hsl(0, 0%, 45%)',
  600: 'hsl(0, 0%, 33%)',
  700: 'hsl(0, 0%, 22%)',
  800: 'hsl(0, 0%, 13%)',
  900: 'hsl(0, 0%, 7%)',
};

// Coral scale (used as accent / warning hue)
export const orange = {
  50: 'hsl(0, 96%, 96%)',
  100: 'hsl(0, 96%, 90%)',
  200: 'hsl(0, 96%, 82%)',
  300: 'hsl(0, 93%, 75%)', // f87171-ish
  400: 'hsl(0, 84%, 60%)',
  500: 'hsl(0, 74%, 50%)',
  600: 'hsl(0, 70%, 42%)',
  700: 'hsl(0, 70%, 32%)',
  800: 'hsl(0, 75%, 22%)',
  900: 'hsl(0, 80%, 14%)',
};

export const green = {
  50: 'hsl(142, 76%, 96%)',
  100: 'hsl(142, 76%, 88%)',
  200: 'hsl(142, 70%, 75%)',
  300: 'hsl(142, 65%, 60%)',
  400: 'hsl(142, 70%, 45%)',
  500: 'hsl(142, 75%, 36%)',
  600: 'hsl(142, 80%, 28%)',
  700: 'hsl(142, 85%, 20%)',
  800: 'hsl(142, 88%, 14%)',
  900: 'hsl(142, 90%, 8%)',
};

export const red = {
  50: 'hsl(0, 85%, 97%)',
  100: 'hsl(0, 80%, 92%)',
  200: 'hsl(0, 75%, 82%)',
  300: 'hsl(0, 70%, 68%)',
  400: 'hsl(0, 75%, 52%)',
  500: 'hsl(0, 80%, 42%)',
  600: 'hsl(0, 85%, 34%)',
  700: 'hsl(0, 90%, 26%)',
  800: 'hsl(0, 95%, 18%)',
  900: 'hsl(0, 100%, 10%)',
};

const PAPER_LIGHT = '#fdfdf7';
const INK_LIGHT = '#111111';
const PAPER_DARK = '#0e1116';
const INK_DARK = '#f4ede0';
const CREAM_LIGHT = '#f5f1e6';
const CREAM_DARK = '#161a22';
const SECONDARY_LIGHT = '#555555';
const SECONDARY_DARK = '#a8a39a';

export const getDesignTokens = (mode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(0, 0%, 0%, 0.6) 4px 4px 0 0'
      : 'hsla(0, 0%, 0%, 0.08) 4px 4px 0 0';

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[600],
        contrastText: PAPER_LIGHT,
        ...(mode === 'dark' && {
          contrastText: INK_DARK,
          light: brand[300],
          main: brand[400],
          dark: brand[500],
        }),
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
        ...(mode === 'dark' && {
          contrastText: brand[300],
          light: brand[400],
          main: brand[500],
          dark: brand[700],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[700],
        ...(mode === 'dark' && {
          light: orange[300],
          main: orange[400],
          dark: orange[600],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[700],
        ...(mode === 'dark' && {
          light: red[300],
          main: red[400],
          dark: red[600],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[700],
        ...(mode === 'dark' && {
          light: green[300],
          main: green[400],
          dark: green[600],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[600], 0.3) : alpha(gray[300], 0.4),
      background: {
        default: PAPER_LIGHT,
        paper: CREAM_LIGHT,
        ...(mode === 'dark' && {
          default: PAPER_DARK,
          paper: CREAM_DARK,
        }),
      },
      text: {
        primary: INK_LIGHT,
        secondary: SECONDARY_LIGHT,
        warning: orange[400],
        ...(mode === 'dark' && {
          primary: INK_DARK,
          secondary: SECONDARY_DARK,
        }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: alpha(gray[200], 0.3),
        ...(mode === 'dark' && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(64),
        fontWeight: 900,
        lineHeight: 0.9,
        letterSpacing: '-0.05em',
      },
      h2: {
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 900,
        lineHeight: 0.95,
        letterSpacing: '-0.04em',
      },
      h3: {
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
      },
      h4: {
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(28),
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(22),
        fontWeight: 900,
        lineHeight: 1.2,
      },
      h6: {
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 900,
        lineHeight: 1.3,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(15),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(16),
        lineHeight: 1.6,
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        lineHeight: 1.55,
      },
      caption: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: defaultTheme.typography.pxToRem(11),
        fontWeight: 500,
        letterSpacing: '0.1em',
      },
      button: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.05em',
      },
    },
    shape: {
      borderRadius: 4,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[600],
        contrastText: PAPER_LIGHT,
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[700],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[700],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: PAPER_LIGHT,
        paper: CREAM_LIGHT,
      },
      text: {
        primary: INK_LIGHT,
        secondary: SECONDARY_LIGHT,
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: alpha(gray[200], 0.3),
      },
      baseShadow: 'hsla(0, 0%, 0%, 0.08) 4px 4px 0 0',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: INK_DARK,
        light: brand[300],
        main: brand[400],
        dark: brand[500],
      },
      info: {
        contrastText: brand[300],
        light: brand[400],
        main: brand[500],
        dark: brand[700],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[600],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[600],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[600],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[600], 0.3),
      background: {
        default: PAPER_DARK,
        paper: CREAM_DARK,
      },
      text: {
        primary: INK_DARK,
        secondary: SECONDARY_DARK,
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow: 'hsla(0, 0%, 0%, 0.6) 4px 4px 0 0',
    },
  },
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  h1: {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(64),
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: '-0.05em',
  },
  h2: {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: '-0.04em',
  },
  h3: {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
  },
  h4: {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(28),
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h5: {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(22),
    fontWeight: 900,
    lineHeight: 1.2,
  },
  h6: {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 900,
    lineHeight: 1.3,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(15),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(16),
    lineHeight: 1.6,
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    lineHeight: 1.55,
  },
  caption: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: defaultTheme.typography.pxToRem(11),
    fontWeight: 500,
    letterSpacing: '0.1em',
  },
  button: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.05em',
  },
};

export const shape = {
  borderRadius: 4,
};

const defaultShadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];

export const shadows = defaultShadows;
```

- [ ] **Step 4: Verify dev server still compiles**

Run: `npm start`
Expected: no compile errors. Existing components still render but with broken colors where they reference removed CSS vars (`--color-gold`, `--color-gold-dim`, `--color-navy`, `--color-navy-light`). Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared-theme/themePrimitives.js src/components/shared-theme/themePrimitives.ts
git commit -m "theme: swap MUI primitives to riso palette and Inter Tight typography"
```

---

### Task 3: Build zine primitive components

**Files:**
- Create: `src/components/shared-theme/zine/Sticker.js`
- Create: `src/components/shared-theme/zine/MonoLabel.js`
- Create: `src/components/shared-theme/zine/AccentRule.js`
- Create: `src/components/shared-theme/zine/MastheadBar.js`
- Create: `src/components/shared-theme/zine/StampCard.js`
- Create: `src/components/shared-theme/zine/index.js`

- [ ] **Step 1: Create `Sticker.js`**

Write `src/components/shared-theme/zine/Sticker.js`:

```js
import * as React from 'react';
import Box from '@mui/material/Box';

const COLOR_MAP = {
  blue: 'var(--color-blue)',
  coral: 'var(--color-coral)',
  ink: 'var(--color-ink)',
};

const CONTRAST_MAP = {
  blue: 'var(--color-paper)',
  coral: 'var(--color-ink)',
  ink: 'var(--color-paper)',
};

export default function Sticker({
  color = 'coral',
  rotate,
  border = true,
  children,
  sx,
  ...rest
}) {
  const finalRotate = React.useMemo(() => {
    if (typeof rotate === 'number') return rotate;
    return (Math.random() * 12 - 6).toFixed(2);
  }, [rotate]);

  const bg = COLOR_MAP[color] || COLOR_MAP.coral;
  const fg = CONTRAST_MAP[color] || CONTRAST_MAP.coral;

  return (
    <Box
      sx={{
        display: 'inline-block',
        backgroundColor: bg,
        color: fg,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        border: border ? '1.5px solid var(--color-ink)' : 'none',
        borderRadius: '2px',
        animation: 'pop 0.4s var(--ease-pop) backwards',
        ['--pop-rotate']: `${finalRotate}deg`,
        transform: `rotate(${finalRotate}deg)`,
        whiteSpace: 'nowrap',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
```

- [ ] **Step 2: Create `MonoLabel.js`**

Write `src/components/shared-theme/zine/MonoLabel.js`:

```js
import * as React from 'react';
import Box from '@mui/material/Box';

export default function MonoLabel({
  color = 'var(--color-blue)',
  prefix,
  children,
  sx,
  ...rest
}) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5em',
        ...sx,
      }}
      {...rest}
    >
      {prefix && (
        <Box component="span" aria-hidden="true">
          {prefix}
        </Box>
      )}
      {children}
    </Box>
  );
}
```

- [ ] **Step 3: Create `AccentRule.js`**

Write `src/components/shared-theme/zine/AccentRule.js`:

```js
import * as React from 'react';
import Box from '@mui/material/Box';

export default function AccentRule({
  color = 'var(--color-blue)',
  width = 48,
  sx,
  ...rest
}) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        width,
        height: 2,
        backgroundColor: color,
        animation: 'drawLine 0.6s var(--ease-out-expo) forwards',
        transformOrigin: 'left',
        ...sx,
      }}
      {...rest}
    />
  );
}
```

- [ ] **Step 4: Create `MastheadBar.js`**

Write `src/components/shared-theme/zine/MastheadBar.js`:

```js
import * as React from 'react';
import Box from '@mui/material/Box';

export default function MastheadBar({ left, right, sx, ...rest }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 0.5, sm: 2 },
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink)',
        borderTop: '2px solid var(--color-ink)',
        borderBottom: '2px solid var(--color-ink)',
        padding: '8px 0',
        ...sx,
      }}
      {...rest}
    >
      <Box component="span">{left}</Box>
      <Box component="span">{right}</Box>
    </Box>
  );
}
```

- [ ] **Step 5: Create `StampCard.js`**

Write `src/components/shared-theme/zine/StampCard.js`:

```js
import * as React from 'react';
import Box from '@mui/material/Box';

export default function StampCard({
  rotate = 0,
  tape = false,
  children,
  sx,
  component = 'div',
  ...rest
}) {
  return (
    <Box
      component={component}
      sx={{
        position: 'relative',
        backgroundColor: 'var(--color-paper)',
        color: 'var(--color-ink)',
        border: '2px solid var(--color-ink)',
        borderRadius: '4px',
        padding: { xs: 2.5, md: 3 },
        boxShadow: '4px 4px 0 0 var(--color-ink)',
        transform: rotate ? `rotate(${rotate}deg)` : 'none',
        transition: 'transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)',
        '&:hover': {
          transform: rotate
            ? `rotate(${rotate}deg) translate(-2px, -2px)`
            : 'translate(-2px, -2px)',
          boxShadow: '6px 6px 0 0 var(--color-ink)',
        },
        ...sx,
      }}
      {...rest}
    >
      {tape && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: -10,
            left: 14,
            width: 48,
            height: 18,
            backgroundColor: 'rgba(248, 113, 113, 0.55)',
            transform: 'rotate(-6deg)',
            border: '1px dashed rgba(17, 17, 17, 0.25)',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </Box>
  );
}
```

- [ ] **Step 6: Create `index.js` barrel export**

Write `src/components/shared-theme/zine/index.js`:

```js
export { default as Sticker } from './Sticker';
export { default as MonoLabel } from './MonoLabel';
export { default as AccentRule } from './AccentRule';
export { default as MastheadBar } from './MastheadBar';
export { default as StampCard } from './StampCard';
```

- [ ] **Step 7: Verify dev server still compiles**

Run: `npm start`
Expected: no compile errors. New components are not yet consumed anywhere. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/components/shared-theme/zine
git commit -m "theme: add zine primitive components (Sticker, MonoLabel, AccentRule, MastheadBar, StampCard)"
```

---

### Task 4: Rewrite `Header.js`

**Files:**
- Modify: `src/components/blog/components/Header.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/Header.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

const navItems = [
  { number: '01', label: 'About', href: '#about' },
  { number: '02', label: 'Experience', href: '#experience' },
  { number: '03', label: 'Portfolio', href: '#portfolio' },
  { number: '04', label: 'Fun Facts', href: '#fun-facts' },
  { number: '05', label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: GitHubIcon, href: 'https://github.com/jonyen', label: 'GitHub' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/jonyen/', label: 'LinkedIn' },
  { icon: DescriptionIcon, href: '/resume', label: 'Resume' },
  { icon: CalendarMonthIcon, href: '/schedule', label: 'Schedule' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const headerRef = React.useRef(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useLayoutEffect(() => {
    if (!headerRef.current) return;
    const height = headerRef.current.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      '--header-height',
      `${height}px`,
    );
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
    setMobileOpen(false);
  };

  return (
    <>
      <Box
        ref={headerRef}
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          py: scrolled ? 1.25 : 2,
          transition: 'all 0.3s var(--ease-out-expo)',
          backgroundColor: scrolled ? 'var(--color-paper)' : 'transparent',
          backdropFilter: scrolled ? 'blur(6px)' : 'none',
          borderBottom: scrolled ? '2px solid var(--color-ink)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              component="a"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 900,
                color: 'var(--color-ink)',
                textDecoration: 'none',
                letterSpacing: '-0.05em',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'var(--color-coral)',
                },
              }}
            >
              JY.
            </Box>

            <Box
              component="nav"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                    px: 1.5,
                    py: 1,
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'var(--color-ink)',
                      backgroundColor: 'transparent',
                    },
                    '& .nav-num': {
                      color: 'var(--color-coral)',
                      marginRight: '0.4em',
                    },
                  }}
                >
                  <Box component="span" className="nav-num">{item.number}</Box>
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.25 }}>
                {socialLinks.map((link) => (
                  <IconButton
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={link.label}
                    sx={{
                      color: 'var(--color-text-secondary)',
                      borderRadius: '2px',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'var(--color-coral)',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <link.icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>

              <ColorModeIconDropdown />

              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
                  color: 'var(--color-ink)',
                  borderRadius: '2px',
                }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'var(--color-paper)',
            backgroundImage: 'none',
            borderLeft: '2px solid var(--color-ink)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-ink)',
              }}
            >
              Menu
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'var(--color-ink)', borderRadius: '2px' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ mb: 4 }}>
            {navItems.map((item, index) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    py: 2,
                    borderBottom: '1px solid var(--color-border)',
                    animation: `slideInFromLeft 0.4s var(--ease-out-expo) forwards`,
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '& .mobile-num': {
                        color: 'var(--color-coral)',
                      },
                    },
                  }}
                >
                  <Box
                    component="span"
                    className="mobile-num"
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-secondary)',
                      mr: 2,
                      letterSpacing: '0.1em',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.number}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        color: 'var(--color-ink)',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {socialLinks.map((link) => (
              <IconButton
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : '_self'}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
                sx={{
                  color: 'var(--color-ink)',
                  border: '2px solid var(--color-ink)',
                  borderRadius: '2px',
                  p: 1.25,
                  '&:hover': {
                    color: 'var(--color-paper)',
                    backgroundColor: 'var(--color-ink)',
                  },
                }}
              >
                <link.icon />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
```

- [ ] **Step 2: Smoke-test the route**

Run: `npm start`. Open `http://localhost:3000/` in a browser. Verify:
- Header logo `JY.` renders in Inter Tight 900.
- Desktop nav items render with `01 ABOUT`, `02 EXPERIENCE`, etc., in mono.
- Scrolling past 50px adds a hard 2px ink bottom border (no gold).
- Mobile drawer opens and renders large display labels with mono numeric prefix.
- Color-mode dropdown still toggles light/dark.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/Header.js
git commit -m "header: zine treatment with numbered mono nav and hard scroll border"
```

---

### Task 5: Rewrite `Hero.js`

**Files:**
- Modify: `src/components/blog/components/Hero.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/Hero.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import profileImage from '../../../assets/profile.png';
import { Sticker, MonoLabel, AccentRule, MastheadBar } from '../../shared-theme/zine';

export default function Hero() {
  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        pt: { xs: 'calc(var(--header-height, 80px) + 16px)', md: 'calc(var(--header-height, 96px) + 32px)' },
        pb: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 4, md: 6 } }} className="animate-in">
          <MastheadBar
            left="VOL.04 · EST. 2009"
            right="DC METRO · USA"
          />
        </Box>

        <Box sx={{ maxWidth: '900px', position: 'relative' }}>
          <Box className="animate-in animate-delay-1" sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.5,
                py: 0.75,
                border: '1.5px solid var(--color-ink)',
                backgroundColor: 'var(--color-paper)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <MonoLabel color="var(--color-ink)">AVAILABLE · DC METRO</MonoLabel>
            </Box>
          </Box>

          <Box
            className="animate-in animate-delay-2"
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: { xs: 3, md: 4 },
              mb: 3,
              flexWrap: 'wrap',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={profileImage}
              alt="Jonathan Yen"
              sx={{
                width: { xs: 96, sm: 120, md: 144 },
                height: { xs: 96, sm: 120, md: 144 },
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-ink)',
                boxShadow: '4px 4px 0 0 var(--color-ink)',
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '3.5rem', sm: '4.5rem', md: '6rem', lg: '7rem' },
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.05em',
                color: 'var(--color-ink)',
              }}
            >
              Jonathan<br />Yen.
            </Typography>

            <Box
              sx={{
                position: 'absolute',
                top: { xs: -8, md: -16 },
                right: { xs: 0, md: 16 },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Sticker color="coral" rotate={8}>★ NEW ★</Sticker>
            </Box>
          </Box>

          <Box className="animate-in animate-delay-3" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AccentRule color="var(--color-blue)" width={48} />
              <MonoLabel color="var(--color-blue)">Full Stack Engineer</MonoLabel>
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: { xs: '1.0625rem', md: '1.25rem' },
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              15+ years writing software for industry-leading companies.
              UC Berkeley alumnus with a passion for building elegant solutions to complex problems.
            </Typography>
          </Box>

          <Box className="animate-in animate-delay-4">
            <Button
              onClick={scrollToAbout}
              endIcon={<ArrowDownwardIcon />}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-paper)',
                backgroundColor: 'var(--color-ink)',
                border: '2px solid var(--color-ink)',
                borderRadius: '2px',
                px: 3,
                py: 1.5,
                boxShadow: '4px 4px 0 0 var(--color-ink)',
                transition: 'all 0.2s var(--ease-out-expo)',
                '&:hover': {
                  backgroundColor: 'var(--color-paper)',
                  color: 'var(--color-ink)',
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '6px 6px 0 0 var(--color-ink)',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateY(2px)',
                  },
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.2s ease',
                },
              }}
            >
              Explore ↓
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test the route**

Run: `npm start`. Confirm:
- Hero shows the masthead bar at top: `VOL.04 · EST. 2009` on the left, `DC METRO · USA` on the right.
- "AVAILABLE · DC METRO" pill with green dot pulse renders.
- Profile image is a circle with hard 2px ink border and 4px-offset hard shadow.
- Headline `Jonathan / Yen.` stacks in Inter Tight 900 with tight line-height.
- Coral `★ NEW ★` sticker rotates ~8° and pops in.
- "EXPLORE ↓" button is ink-filled with hard offset shadow; hover inverts to paper-on-ink and the shadow grows.
- Test light and dark mode.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/Hero.js
git commit -m "hero: zine treatment with masthead, sticker, and hard-shadow CTA"
```

---

### Task 6: Rewrite `About.js`

**Files:**
- Modify: `src/components/blog/components/About.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/About.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Sticker, MonoLabel } from '../../shared-theme/zine';

const techStack = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'GraphQL', 'Next.js'] },
  { category: 'Backend', items: ['Node.js', 'Ruby on Rails', 'Python'] },
  { category: 'Mobile', items: ['iOS', 'Android', 'Responsive Web'] },
  { category: 'Infrastructure', items: ['AWS', 'PostgreSQL', 'Redis', 'Docker'] },
];

export default function About() {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      component="section"
      id="about"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 20, md: 40 },
          left: { xs: 16, md: 56 },
          display: { xs: 'none', md: 'block' },
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.4s',
          zIndex: 1,
        }}
      >
        <Sticker color="blue" rotate={-3}>HELLO</Sticker>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: { md: 'sticky' },
                top: { md: 120 },
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s var(--ease-out-expo)',
              }}
            >
              <Box sx={{ mb: 2 }}>
                <MonoLabel prefix="01 —" color="var(--color-coral)">About</MonoLabel>
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: 'var(--color-ink)',
                }}
              >
                Building the<br />
                <Box component="span" sx={{ color: 'var(--color-blue)' }}>digital future</Box>
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s var(--ease-out-expo) 0.2s',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: { xs: '1.0625rem', md: '1.1875rem' },
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                A software engineer by trade, I've worked at industry-leading companies over the
                past 15 years and have collaborated with some of the brightest minds in the industry.
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: { xs: '1rem', md: '1.0625rem' },
                  fontWeight: 400,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  mb: 6,
                }}
              >
                Educated at UC Berkeley, I spent over 10 years in the Bay Area before moving to
                Northern Virginia where I currently reside. Outside of work, I'm a Sunday school
                teacher and I lead my church's children's ministry of over 40 kids along with my wife.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3,
                  pt: 4,
                  borderTop: '2px solid var(--color-ink)',
                }}
              >
                {techStack.map((stack, index) => (
                  <Box
                    key={stack.category}
                    sx={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.6s var(--ease-out-expo) ${0.4 + index * 0.1}s`,
                    }}
                  >
                    <Box sx={{ mb: 1.5 }}>
                      <MonoLabel color="var(--color-blue)">{stack.category}</MonoLabel>
                    </Box>
                    {stack.items.map((item) => (
                      <Typography
                        key={item}
                        sx={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          color: 'var(--color-text-secondary)',
                          mb: 0.75,
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test**

Run: `npm start`. Scroll to the About section. Confirm:
- Decorative `HELLO` sticker pops in top-left at md+ breakpoint.
- "01 — About" mono eyebrow renders in coral.
- Heading reads `Building the digital future` with "digital future" in blue.
- Tech-stack categories sit under a hard 2px ink top border, each prefixed with a blue mono label.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/About.js
git commit -m "about: zine treatment with MonoLabel eyebrow and HELLO sticker"
```

---

### Task 7: Rewrite `Experience.js`

**Files:**
- Modify: `src/components/blog/components/Experience.js` (full rewrite)

**Deviation from spec:** The spec calls for cards to alternate left/right horizontal offset (~±32px) at md+. The existing layout is a 6-column grid; injecting per-card offset breaks alignment. The plan keeps the rotation rhythm (`[-2, 1, -1, 2, -2, 1]`) which captures the same visual energy without fighting the grid.

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/Experience.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import mercorLogo from '../../../assets/mercor-logo.png';
import atlassianLogo from '../../../assets/atlassian-logo.svg';
import medalliaLogo from '../../../assets/medallia-logo.png';
import cventLogo from '../../../assets/cvent-logo.png';
import ibmLogo from '../../../assets/IBM-8-bar-logo.svg';
import asperaLogo from '../../../assets/aspera-seeklogo.png';
import { MonoLabel, StampCard } from '../../shared-theme/zine';

const companies = [
  { name: 'Aspera', logo: asperaLogo, years: '2011 - 2015', href: 'https://ibm.com/aspera' },
  { name: 'IBM', logo: ibmLogo, years: '2015 - 2019', href: 'https://ibm.com' },
  { name: 'Cvent', logo: cventLogo, years: '2019 - 2020', href: 'https://cvent.com' },
  { name: 'Medallia', logo: medalliaLogo, years: '2020 - 2022', href: 'https://medallia.com' },
  { name: 'Atlassian', logo: atlassianLogo, years: '2022 - 2025', href: 'https://atlassian.com' },
  { name: 'Mercor', logo: mercorLogo, years: '2025 - Current', href: 'https://mercor.com' },
];

const ROTATIONS = [-2, 1, -1, 2, -2, 1];

function CompanyCard({ company, index, isVisible }) {
  const { mode } = useColorScheme();
  const [isHovered, setIsHovered] = React.useState(false);
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const tape = index % 2 === 1;

  return (
    <StampCard
      component="a"
      href={company.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      rotate={rotate}
      tape={tape}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s var(--ease-out-expo) ${0.1 + index * 0.05}s`,
      }}
    >
      <Box
        sx={{
          width: { xs: 60, md: 80 },
          height: { xs: 30, md: 40 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={company.logo}
          alt={`${company.name} logo`}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: mode === 'dark'
              ? 'grayscale(100%) invert(1) brightness(1)'
              : 'grayscale(100%)',
            opacity: isHovered ? 1 : 0.7,
            transition: 'all 0.3s ease',
            ...(isHovered && {
              filter: 'none',
              opacity: 1,
            }),
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '1rem', md: '1.125rem' },
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          mb: 0.5,
        }}
      >
        {company.name}
      </Typography>
      <Box>
        <MonoLabel color="var(--color-text-secondary)">{company.years}</MonoLabel>
      </Box>
    </StampCard>
  );
}

export default function Experience() {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      component="section"
      id="experience"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-paper)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s var(--ease-out-expo)',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <MonoLabel prefix="02 —" color="var(--color-coral)">Experience</MonoLabel>
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: 'var(--color-ink)',
              mb: 2,
            }}
          >
            Where I&rsquo;ve worked
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            From startups to enterprise, building products that scale.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
            gap: { xs: 3, md: 4 },
            rowGap: { xs: 5, md: 6 },
          }}
        >
          {companies.map((company, index) => (
            <CompanyCard
              key={company.name}
              company={company}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test**

Run: `npm start`. Scroll to Experience. Confirm:
- "02 — Experience" mono eyebrow renders in coral.
- Six cards render as `StampCard`s with alternating rotations and tape on odd-indexed cards.
- Logos go from grayscale to full color on hover; card lifts up-left and the offset shadow grows.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/Experience.js
git commit -m "experience: zine treatment with StampCard rotations and mono date labels"
```

---

### Task 8: Rewrite landing-page `Portfolio.js`

**Files:**
- Modify: `src/components/blog/components/Portfolio.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/Portfolio.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import asperaLogo from '../../../assets/aspera-seeklogo.png';
import { MonoLabel, StampCard, Sticker } from '../../shared-theme/zine';

const projects = [
  {
    title: 'Bolt to Yarn Migration',
    company: 'Atlassian',
    summary: 'Led cross-departmental initiative to modernize Confluence frontend build infrastructure.',
    impact: '8.5x faster startup',
    tags: ['Technical Leadership', 'TypeScript'],
  },
  {
    title: 'Social Logins for Crowdicity',
    company: 'Medallia',
    summary: 'Shipped OAuth2 social authentication with cross-provider compatibility.',
    impact: 'Frictionless auth for thousands',
    tags: ['Authentication', 'Full Stack'],
  },
  {
    title: 'Aspera on Demand',
    company: 'IBM / Aspera',
    summary: 'Built and optimized AWS deployment infrastructure for high-speed file transfers.',
    impact: '15x faster deployment',
    tags: ['AWS', 'Automation'],
  },
];

const ROTATIONS = [-1, 1, -1];

function ProjectIconDisplay({ title }) {
  const iconColor = 'var(--color-text-secondary)';

  if (title === 'Bolt to Yarn Migration') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, opacity: 0.6 }}>
        <Box component="span" sx={{ fontSize: '1.25rem', lineHeight: 1, filter: 'grayscale(1)' }}>⚡</Box>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={iconColor}>
          <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z" />
        </svg>
      </Box>
    );
  }

  if (title === 'Social Logins for Crowdicity') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, color: iconColor }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" opacity="0.7" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.85" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" opacity="0.6" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Box>
    );
  }

  if (title === 'Aspera on Demand') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, color: iconColor }}>
        <Box
          component="img"
          src={asperaLogo}
          alt="Aspera"
          sx={{
            height: 16,
            width: 'auto',
            filter: 'brightness(0) opacity(0.45)',
            '[data-mui-color-scheme="dark"] &': {
              filter: 'brightness(0) invert(1) opacity(0.45)',
            },
          }}
        />
      </Box>
    );
  }

  return null;
}

function ProjectCard({ project, index, isVisible }) {
  const rotate = ROTATIONS[index % ROTATIONS.length];

  return (
    <StampCard
      component={Link}
      to="/portfolio"
      rotate={rotate}
      sx={{
        display: 'block',
        textDecoration: 'none',
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s var(--ease-out-expo) ${0.1 + index * 0.08}s`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <MonoLabel color="var(--color-blue)">{project.company}</MonoLabel>
        <ProjectIconDisplay title={project.title} />
      </Box>

      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '1.25rem', md: '1.375rem' },
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          mb: 1.5,
          lineHeight: 1.1,
        }}
      >
        {project.title}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.55,
          mb: 2,
        }}
      >
        {project.summary}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Sticker color="coral" rotate={4}>{project.impact}</Sticker>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {project.tags.map((tag) => (
          <Box
            key={tag}
            sx={{
              px: 1.25,
              py: 0.25,
              border: '1.5px solid var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-ink)',
            }}
          >
            {tag}
          </Box>
        ))}
      </Box>
    </StampCard>
  );
}

export default function Portfolio() {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      component="section"
      id="portfolio"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-cream)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s var(--ease-out-expo)',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <MonoLabel prefix="03 —" color="var(--color-coral)">Featured Work</MonoLabel>
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: 'var(--color-ink)',
              mb: 2,
            }}
          >
            Project highlights
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            A few initiatives where I drove meaningful technical impact.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 5, md: 4 },
            maxWidth: 1100,
            mx: 'auto',
            mb: { xs: 6, md: 8 },
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s var(--ease-out-expo) 0.4s',
          }}
        >
          <Button
            component={Link}
            to="/portfolio"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              px: 3,
              py: 1.5,
              border: '2px solid var(--color-ink)',
              borderRadius: '2px',
              boxShadow: '4px 4px 0 0 var(--color-ink)',
              transition: 'all 0.2s var(--ease-out-expo)',
              '&:hover': {
                backgroundColor: 'var(--color-coral)',
                transform: 'translate(-2px, -2px)',
                boxShadow: '6px 6px 0 0 var(--color-ink)',
              },
            }}
          >
            View full portfolio →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test**

Run: `npm start`. Scroll to Portfolio. Confirm:
- "03 — Featured Work" mono eyebrow in coral.
- Three project cards as `StampCard`s with rotations -1°, 1°, -1°.
- Each impact value renders inside a coral `Sticker`.
- Tags render as small mono-text boxes with hard ink border.
- "View full portfolio →" button has hard offset shadow; hover lifts and turns coral.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/Portfolio.js
git commit -m "portfolio: zine treatment for landing-page section with StampCards and impact stickers"
```

---

### Task 9: Rewrite `FunFacts.js`

**Files:**
- Modify: `src/components/blog/components/FunFacts.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/FunFacts.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PublicIcon from '@mui/icons-material/Public';
import ExtensionIcon from '@mui/icons-material/Extension';
import TranslateIcon from '@mui/icons-material/Translate';
import { Link } from 'react-router-dom';
import { getDaysSince } from '../../../utils/dateUtils';
import { MonoLabel, StampCard, Sticker } from '../../shared-theme/zine';

const DUOLINGO_USERNAME = 'jon.yen';
const DUOLINGO_API_URL = `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(
  DUOLINGO_USERNAME
)}&fields=streak,streakData%7BcurrentStreak,previousStreak%7D`;

const ROTATIONS = [-4, 2, -1, 5];
const TAPE_FLAGS = [false, true, true, false];

function FactCard({ fact, index, isVisible, streakSticker }) {
  const Icon = fact.icon;
  const isClickable = !!fact.link;
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const tape = TAPE_FLAGS[index % TAPE_FLAGS.length];

  const card = (
    <StampCard
      rotate={rotate}
      tape={tape}
      sx={{
        height: '100%',
        cursor: isClickable ? 'pointer' : 'default',
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s var(--ease-out-expo) ${0.1 + index * 0.1}s`,
      }}
    >
      {streakSticker && (
        <Box sx={{ position: 'absolute', top: -14, right: -6 }}>
          <Sticker color="coral" rotate={10}>{streakSticker}</Sticker>
        </Box>
      )}

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          border: '2px solid var(--color-ink)',
          backgroundColor: 'var(--color-paper)',
          color: 'var(--color-ink)',
          mb: 2.5,
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>

      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '2.25rem', md: '2.75rem' },
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          color: 'var(--color-ink)',
          mb: 1,
        }}
      >
        {fact.number}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.0625rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          mb: 1,
        }}
      >
        {fact.label}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}
      >
        {fact.description}
      </Typography>

      {isClickable && (
        <Box sx={{ position: 'absolute', bottom: 10, right: 12 }}>
          <MonoLabel color="var(--color-coral)">View all →</MonoLabel>
        </Box>
      )}
    </StampCard>
  );

  if (isClickable) {
    return (
      <Link to={fact.link} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {card}
      </Link>
    );
  }

  return card;
}

export default function FunFacts() {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [duolingoStreak, setDuolingoStreak] = React.useState(
    () => getDaysSince('2025-01-01')
  );
  const [streakFromApi, setStreakFromApi] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    fetch(DUOLINGO_API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Duolingo API returned ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        const user = data?.users?.[0];
        const streak =
          user?.streakData?.currentStreak?.length ??
          user?.streakData?.previousStreak?.length ??
          user?.streak;
        if (typeof streak === 'number' && streak > 0) {
          setDuolingoStreak(streak);
          setStreakFromApi(true);
        }
      })
      .catch(() => {
        // Fall back silently to the computed days-since value.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const facts = [
    {
      icon: DirectionsRunIcon,
      number: '4',
      label: 'Marathons',
      description: 'Plus countless half-marathons',
    },
    {
      icon: PublicIcon,
      number: '20+',
      label: 'Countries',
      description: 'Across 4 continents',
      link: '/travel',
    },
    {
      icon: ExtensionIcon,
      number: getDaysSince('2020-03-23').toLocaleString(),
      label: 'Day Crossword Streak',
      description: 'NY Times, since COVID lockdown',
    },
    {
      icon: TranslateIcon,
      number: duolingoStreak.toLocaleString(),
      label: 'Day Duolingo Streak',
      description: 'Learning languages daily since 1/1/2025',
    },
  ];

  return (
    <Box
      component="section"
      id="fun-facts"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-paper)',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s var(--ease-out-expo)',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <MonoLabel prefix="04 —" color="var(--color-coral)">Beyond Code</MonoLabel>
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: 'var(--color-ink)',
              mb: 2,
            }}
          >
            Fun facts about me
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            There&rsquo;s more to life than just code.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: { xs: 4, md: 5 },
            rowGap: { xs: 5, md: 6 },
          }}
        >
          {facts.map((fact, index) => (
            <FactCard
              key={fact.label}
              fact={fact}
              index={index}
              isVisible={isVisible}
              streakSticker={
                fact.label === 'Day Duolingo Streak' && streakFromApi
                  ? `★ ${duolingoStreak}d ★`
                  : null
              }
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test**

Run: `npm start`. Scroll to Fun Facts. Confirm:
- "04 — Beyond Code" mono eyebrow in coral.
- Four `StampCard`s render with rotations `[-4, 2, -1, 5]`, tape on indices 1 and 2.
- Icons sit inside a 2px ink-bordered square.
- Numbers render in Inter Tight 900 with tight letter-spacing.
- Countries card links to `/travel` and shows mono `View all →` at the bottom-right.
- If the Duolingo API call succeeds, a coral `★ {streak}d ★` sticker pops on the streak card. If it fails, the card still renders cleanly.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/FunFacts.js
git commit -m "funfacts: zine scrapbook treatment with StampCard rotations and Duolingo sticker"
```

---

### Task 10: Rewrite `Contact.js`

**Files:**
- Modify: `src/components/blog/components/Contact.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/Contact.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { MonoLabel, StampCard } from '../../shared-theme/zine';

const contactLinks = [
  { label: 'GitHub', href: 'https://github.com/jonyen' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonyen/' },
  { label: 'Resume', href: '/resume' },
  { label: 'Schedule', href: '/schedule' },
];

export default function Contact() {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      component="section"
      id="contact"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s var(--ease-out-expo)',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <MonoLabel prefix="05 —" color="var(--color-coral)">Get in Touch</MonoLabel>
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              color: 'var(--color-ink)',
              mb: 3,
            }}
          >
            Let&rsquo;s build something<br />
            <Box component="span" sx={{ color: 'var(--color-blue)' }}>together</Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: { xs: '1.0625rem', md: '1.1875rem' },
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              mx: 'auto',
              mb: 4,
            }}
          >
            Whether you have a project in mind or just want to chat about tech,
            I&rsquo;m always happy to connect.
          </Typography>

          <Button
            href="/schedule"
            endIcon={<ArrowOutwardIcon />}
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-paper)',
              backgroundColor: 'var(--color-ink)',
              border: '2px solid var(--color-ink)',
              borderRadius: '2px',
              px: 4,
              py: 1.75,
              boxShadow: '4px 4px 0 0 var(--color-ink)',
              transition: 'all 0.2s var(--ease-out-expo)',
              '&:hover': {
                backgroundColor: 'var(--color-coral)',
                color: 'var(--color-ink)',
                transform: 'translate(-2px, -2px)',
                boxShadow: '6px 6px 0 0 var(--color-ink)',
                '& .MuiSvgIcon-root': {
                  transform: 'translate(2px, -2px)',
                },
              },
              '& .MuiSvgIcon-root': {
                transition: 'transform 0.2s ease',
              },
            }}
          >
            Schedule a Call
          </Button>
        </Box>

        <StampCard
          tape
          sx={{
            maxWidth: 720,
            mx: 'auto',
            p: { xs: 3, md: 4 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s var(--ease-out-expo) 0.2s',
            '&:hover': {
              transform: 'translateY(0)',
              boxShadow: '4px 4px 0 0 var(--color-ink)',
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <MonoLabel color="var(--color-blue)">FIND ME AT</MonoLabel>
          </Box>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {contactLinks.map((link) => (
              <Box
                key={link.label}
                component="li"
                sx={{
                  display: 'block',
                }}
              >
                <Box
                  component="a"
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.25,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    py: 0.75,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '1.25rem',
                      right: 0,
                      bottom: 6,
                      height: '2px',
                      backgroundColor: 'var(--color-coral)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s var(--ease-out-expo)',
                    },
                    '&:hover': {
                      color: 'var(--color-coral)',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                    },
                  }}
                >
                  <Box component="span" aria-hidden="true">→</Box>
                  {link.label}
                </Box>
              </Box>
            ))}
          </Box>
        </StampCard>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test**

Run: `npm start`. Scroll to Contact. Confirm:
- "05 — Get in Touch" mono eyebrow in coral.
- Headline `Let's build something / together` with "together" in blue.
- "Schedule a Call" button has hard offset shadow; hover lifts and turns coral.
- A StampCard with tape decoration lists four mono links (`→ GITHUB`, `→ LINKEDIN`, `→ RESUME`, `→ SCHEDULE`). Hover draws a coral underline from left to right.
- External links open in a new tab; `/schedule` and `/resume` stay in the same tab.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/Contact.js
git commit -m "contact: zine treatment with mono link rows and tape-decorated StampCard"
```

---

### Task 11: Rewrite `Footer.js`

**Files:**
- Modify: `src/components/blog/components/Footer.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/blog/components/Footer.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, md: 4 },
        backgroundColor: 'var(--color-paper)',
        borderTop: '2px solid var(--color-ink)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-ink)',
            textAlign: 'center',
          }}
        >
          © {year} Jonathan Yen · Printed in 2 Inks · No.21
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test**

Run: `npm start`. Scroll to the very bottom. Confirm:
- Single centered mono row reads `© 2026 JONATHAN YEN · PRINTED IN 2 INKS · NO.21`.
- Footer sits under a hard 2px ink top border.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/components/Footer.js
git commit -m "footer: minimal mono masthead-style footer line"
```

---

### Task 12: Rewrite Travel pieces (PassportHeader + TravelPage shell)

**Files:**
- Modify: `src/components/travel/TravelPage.js` (full rewrite)
- Modify: `src/components/travel/components/PassportHeader.js` (full rewrite)

- [ ] **Step 1: Overwrite `PassportHeader.js`**

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MonoLabel, AccentRule, StampCard } from '../../shared-theme/zine';

export default function PassportHeader({ countCountries }) {
  return (
    <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 4, md: 5 } }}>
      <Box sx={{ mb: 2 }}>
        <MonoLabel prefix="●" color="var(--color-blue)">
          Travel Record · Field Notes
        </MonoLabel>
      </Box>

      <Typography
        component="h1"
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
          color: 'var(--color-ink)',
          mb: 2,
        }}
      >
        Passport.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <AccentRule color="var(--color-coral)" width={48} />
        <MonoLabel color="var(--color-coral)">
          {countCountries}+ Countries · 4 Continents
        </MonoLabel>
      </Box>

      <StampCard
        sx={{
          maxWidth: 520,
          p: { xs: 2.5, md: 3 },
          '&:hover': {
            transform: 'none',
            boxShadow: '4px 4px 0 0 var(--color-ink)',
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
            columnGap: 3,
            rowGap: 1.25,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <Box component="span" sx={{ color: 'var(--color-text-secondary)' }}>Passport No.</Box>
          <Box component="span" sx={{ color: 'var(--color-ink)', fontWeight: 700 }}>JY-2009</Box>
          <Box component="span" sx={{ color: 'var(--color-text-secondary)' }}>Name</Box>
          <Box component="span" sx={{ color: 'var(--color-ink)', fontWeight: 700 }}>Jonathan Yen</Box>
          <Box component="span" sx={{ color: 'var(--color-text-secondary)' }}>Nationality</Box>
          <Box component="span" sx={{ color: 'var(--color-ink)', fontWeight: 700 }}>USA · DC Metro</Box>
        </Box>
      </StampCard>
    </Box>
  );
}
```

- [ ] **Step 2: Overwrite `TravelPage.js`**

```js
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import PassportHeader from './components/PassportHeader';
import WorldMap from './components/WorldMap';
import CountryStamps, { countries as visitedCountries } from './components/CountryStamps';
import { MastheadBar, MonoLabel } from '../shared-theme/zine';

export default function TravelPage(props) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="noise-overlay">
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            py: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-paper)',
            borderBottom: '2px solid var(--color-ink)',
          }}
        >
          <IconButton
            component={Link}
            to="/"
            sx={{
              color: 'var(--color-ink)',
              borderRadius: '2px',
              '&:hover': {
                color: 'var(--color-coral)',
                backgroundColor: 'transparent',
              },
            }}
            aria-label="Back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'none', '@media (min-width: 600px)': { display: 'block' } }}>
            <MonoLabel color="var(--color-ink)">FIELD NOTES · TRAVEL</MonoLabel>
          </Box>
          <ColorModeIconDropdown />
        </Box>

        <Box
          component="main"
          sx={{
            pt: { xs: 9, md: 11 },
            pb: { xs: 6, md: 10 },
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <MastheadBar left="FIELD NOTES · TRAVEL" right="JONATHAN YEN" />
            </Box>

            <PassportHeader countCountries={visitedCountries.length} />
            <WorldMap />
            <CountryStamps />

            <Box sx={{ mt: { xs: 5, md: 7 }, textAlign: 'center' }}>
              <MonoLabel prefix="●" color="var(--color-coral)">
                More adventures to come
              </MonoLabel>
            </Box>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}
```

Note: `TravelPage` now imports `countries` from `CountryStamps`. Task 14 exports it explicitly.

- [ ] **Step 3: Smoke-test (after Task 14 also lands)**

Defer the smoke test to the end of Task 14 — `countries` is not yet exported. Commit the changes; the route will still compile because the import default-renders the `CountryStamps` component plus a named re-export that Task 14 will add.

Actually, run `npm start` now to confirm a compile failure is the only blocker. Expected: compile error citing the missing export `countries` from `CountryStamps`. That is fine; Task 14 fixes it. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/travel/TravelPage.js src/components/travel/components/PassportHeader.js
git commit -m "travel: zine treatment for PassportHeader and TravelPage shell"
```

---

### Task 13: Rewrite `WorldMap.js`

**Files:**
- Modify: `src/components/travel/components/WorldMap.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/travel/components/WorldMap.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { MonoLabel } from '../../shared-theme/zine';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const visitedCountries = [
  { name: 'Thailand', coordinates: [100.5018, 13.7563], code: 'THA' },
  { name: 'Cambodia', coordinates: [104.9282, 11.5564], code: 'KHM' },
  { name: 'Vietnam', coordinates: [105.8342, 21.0285], code: 'VNM' },
  { name: 'Malaysia', coordinates: [101.6869, 3.1390], code: 'MYS' },
  { name: 'Taiwan', coordinates: [121.5654, 25.0330], code: 'TWN' },
  { name: 'China', coordinates: [116.4074, 39.9042], code: 'CHN' },
  { name: 'South Korea', coordinates: [126.9780, 37.5665], code: 'KOR' },
  { name: 'Singapore', coordinates: [103.8198, 1.3521], code: 'SGP' },
  { name: 'Japan', coordinates: [139.6917, 35.6895], code: 'JPN' },
  { name: 'Canada', coordinates: [-106.3468, 56.1304], code: 'CAN' },
  { name: 'Mexico', coordinates: [-99.1332, 19.4326], code: 'MEX' },
  { name: 'Guatemala', coordinates: [-90.5328, 14.6349], code: 'GTM' },
  { name: 'Australia', coordinates: [151.2093, -33.8688], code: 'AUS' },
  { name: 'Germany', coordinates: [13.4050, 52.5200], code: 'DEU' },
  { name: 'France', coordinates: [2.3522, 48.8566], code: 'FRA' },
  { name: 'Switzerland', coordinates: [8.5417, 47.3769], code: 'CHE' },
  { name: 'United Kingdom', coordinates: [-0.1276, 51.5074], code: 'GBR' },
  { name: 'Belgium', coordinates: [4.3517, 50.8503], code: 'BEL' },
  { name: 'Denmark', coordinates: [12.5683, 55.6761], code: 'DNK' },
  { name: 'Italy', coordinates: [12.4964, 41.9028], code: 'ITA' },
  { name: 'Greece', coordinates: [23.7275, 37.9838], code: 'GRC' },
  { name: 'Austria', coordinates: [16.3738, 48.2082], code: 'AUT' },
  { name: 'Netherlands', coordinates: [4.9041, 52.3676], code: 'NLD' },
  { name: 'Iceland', coordinates: [-21.9426, 64.1466], code: 'ISL' },
];

const visitedCountryCodes = visitedCountries.map((c) => c.code);

export default function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = React.useState(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (event, country) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setHoveredCountry(country);
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        my: { xs: 4, md: 6 },
        p: { xs: 2.5, md: 3.5 },
        backgroundColor: 'var(--color-paper)',
        border: '2px solid var(--color-ink)',
        boxShadow: '4px 4px 0 0 var(--color-ink)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '2px solid var(--color-ink)',
        }}
      >
        <MonoLabel color="var(--color-ink)">World Map</MonoLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 10, height: 10, backgroundColor: 'var(--color-blue)' }} />
          <MonoLabel color="var(--color-text-secondary)">Visited</MonoLabel>
        </Box>
      </Box>

      <Box
        sx={{
          aspectRatio: '2/1',
          minHeight: { xs: 200, md: 300 },
          '& svg': {
            width: '100%',
            height: '100%',
          },
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [20, 30],
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedCountryCodes.includes(
                    geo.properties.ISO_A3 || geo.id
                  );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseMove={(e) =>
                        isVisited && handleMouseMove(e, geo.properties.name)
                      }
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isVisited ? 'var(--color-blue)' : 'var(--color-paper)',
                          stroke: 'var(--color-ink)',
                          strokeWidth: 0.4,
                          outline: 'none',
                          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
                        },
                        hover: {
                          fill: isVisited ? 'var(--color-blue)' : 'var(--color-paper)',
                          stroke: 'var(--color-coral)',
                          strokeWidth: 2,
                          outline: 'none',
                          cursor: isVisited ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: isVisited ? 'var(--color-blue)' : 'var(--color-paper)',
                          stroke: 'var(--color-coral)',
                          strokeWidth: 2,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {visitedCountries.map((country, index) => (
              <Marker
                key={country.code}
                coordinates={country.coordinates}
                onMouseMove={(e) => handleMouseMove(e, country.name)}
                onMouseLeave={handleMouseLeave}
              >
                <circle
                  r={3.5}
                  fill="var(--color-coral)"
                  stroke="var(--color-paper)"
                  strokeWidth={1.5}
                  style={{
                    cursor: 'pointer',
                    animation: 'mapPulse 2s ease-in-out infinite',
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </Box>

      {hoveredCountry && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltipPosition.x + 12,
            top: tooltipPosition.y - 32,
            backgroundColor: 'var(--color-paper)',
            color: 'var(--color-ink)',
            border: '1.5px solid var(--color-ink)',
            px: 1.25,
            py: 0.5,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '3px 3px 0 0 var(--color-ink)',
          }}
        >
          {hoveredCountry}
        </Box>
      )}

      <style>
        {`
          @keyframes mapPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.4);
              opacity: 0.75;
            }
          }
        `}
      </style>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test (after Task 14)**

Hold the smoke test until Task 14 lands; map still doesn't compile until `CountryStamps` exports `countries`.

- [ ] **Step 3: Commit**

```bash
git add src/components/travel/components/WorldMap.js
git commit -m "worldmap: riso fills, coral hover stroke, mono tooltip"
```

---

### Task 14: Rewrite `CountryStamps.js`

**Files:**
- Modify: `src/components/travel/components/CountryStamps.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/travel/components/CountryStamps.js` with:

```js
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { MonoLabel, StampCard, Sticker } from '../../shared-theme/zine';

export const countries = [
  { name: 'Thailand', region: 'Asia', flag: '🇹🇭' },
  { name: 'Cambodia', region: 'Asia', flag: '🇰🇭' },
  { name: 'Vietnam', region: 'Asia', flag: '🇻🇳' },
  { name: 'Malaysia', region: 'Asia', flag: '🇲🇾' },
  { name: 'Taiwan', region: 'Asia', flag: '🇹🇼' },
  { name: 'China', region: 'Asia', flag: '🇨🇳' },
  { name: 'South Korea', region: 'Asia', flag: '🇰🇷' },
  { name: 'Singapore', region: 'Asia', flag: '🇸🇬' },
  { name: 'Japan', region: 'Asia', flag: '🇯🇵' },
  { name: 'Canada', region: 'Americas', flag: '🇨🇦' },
  { name: 'Mexico', region: 'Americas', flag: '🇲🇽' },
  { name: 'Guatemala', region: 'Americas', flag: '🇬🇹' },
  { name: 'Australia', region: 'Oceania', flag: '🇦🇺' },
  { name: 'Germany', region: 'Europe', flag: '🇩🇪' },
  { name: 'France', region: 'Europe', flag: '🇫🇷' },
  { name: 'Switzerland', region: 'Europe', flag: '🇨🇭' },
  { name: 'England', region: 'Europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Belgium', region: 'Europe', flag: '🇧🇪' },
  { name: 'Denmark', region: 'Europe', flag: '🇩🇰' },
  { name: 'Italy', region: 'Europe', flag: '🇮🇹' },
  { name: 'Greece', region: 'Europe', flag: '🇬🇷' },
  { name: 'Austria', region: 'Europe', flag: '🇦🇹' },
  { name: 'Netherlands', region: 'Europe', flag: '🇳🇱' },
  { name: 'Iceland', region: 'Europe', flag: '🇮🇸' },
];

const ROTATIONS = [-4, -2, 2, 4];
const TAPE_FLAGS = [true, false, true, false];

function StampItem({ country, index }) {
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const tape = TAPE_FLAGS[index % TAPE_FLAGS.length];

  return (
    <StampCard
      rotate={rotate}
      tape={tape}
      sx={{
        p: { xs: 2, md: 2.5 },
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <Box sx={{ position: 'absolute', top: -10, right: -8 }}>
        <Sticker color="coral" rotate={6}>{country.flag}</Sticker>
      </Box>

      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          lineHeight: 1,
          mb: 1.5,
        }}
      >
        {country.flag}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '0.875rem', md: '1rem' },
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          lineHeight: 1.1,
          mb: 0.5,
        }}
      >
        {country.name}
      </Typography>

      <MonoLabel color="var(--color-text-secondary)">{country.region}</MonoLabel>
    </StampCard>
  );
}

export default function CountryStamps() {
  const regions = ['Asia', 'Europe', 'Americas', 'Oceania'];

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 1.5 }}>
          <MonoLabel color="var(--color-coral)">Collection</MonoLabel>
        </Box>
        <Typography
          component="h3"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '2rem', md: '2.75rem' },
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'var(--color-ink)',
          }}
        >
          Passport Stamps
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 1.5, md: 2 },
          mb: { xs: 5, md: 6 },
        }}
      >
        {regions.map((region) => {
          const count = countries.filter((c) => c.region === region).length;
          return (
            <Box
              key={region}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                border: '1.5px solid var(--color-ink)',
                backgroundColor: 'var(--color-paper)',
              }}
            >
              <MonoLabel color="var(--color-ink)">{region}</MonoLabel>
              <Box
                component="span"
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--color-coral)',
                  fontWeight: 700,
                }}
              >
                ({count})
              </Box>
            </Box>
          );
        })}
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }} rowSpacing={{ xs: 4, md: 5 }} justifyContent="center">
        {countries.map((country, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={country.name}>
            <StampItem country={country} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 2: Smoke-test the entire `/travel` route**

Run: `npm start`. Open `http://localhost:3000/travel`. Confirm:
- Fixed top bar with back arrow on left, `FIELD NOTES · TRAVEL` mono label centered (md+), color mode dropdown on right.
- Page masthead bar, then `Passport.` headline in Inter Tight 900.
- Passport-info `StampCard` shows mono labels for Passport No., Name, Nationality.
- World map renders inside a paper card with 2px ink border and 4px-offset shadow.
  - Visited countries fill blue.
  - Unvisited countries fill paper with ink hairline.
  - Hover stroke turns coral 2px on any country.
  - Coral marker dots pulse on visited countries.
- Region legend pills show `ASIA (9)`, `EUROPE (11)`, `AMERICAS (3)`, `OCEANIA (1)`.
- Country stamps render as rotated `StampCard`s with flag in a corner coral sticker plus the large flag inside.
- Test in light and dark mode.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/travel/components/CountryStamps.js
git commit -m "stamps: zine StampCard rotations, region legend in mono pills, named countries export"
```

---

### Task 15: Rewrite `PortfolioPage.js`

**Files:**
- Modify: `src/components/portfolio/PortfolioPage.js` (full rewrite)

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/portfolio/PortfolioPage.js` with:

```js
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import asperaLogo from '../../assets/aspera-seeklogo.png';
import { MastheadBar, MonoLabel, StampCard, Sticker, AccentRule } from '../shared-theme/zine';

const projects = [
  {
    title: 'Bolt to Yarn Migration',
    company: 'Atlassian',
    tags: ['Technical Leadership', 'Developer Experience', 'TypeScript'],
    summary: 'Led a high-visibility, cross-departmental initiative to modernize the Confluence frontend build infrastructure, delivering an 8.5x improvement in developer environment startup time for hundreds of engineers.',
    description: [
      'This project had me owning the end-to-end migration from Bolt—a package management toolkit abandoned by its maintainer for over a year—to Yarn v2. Bolt\'s workspace management capabilities had made it valuable for the Confluence monorepo, but its lack of maintenance had become a liability blocking critical engineering initiatives.',
      'After evaluating alternatives including pnpm and npm, I recommended Yarn v2 and authored a comprehensive technical proposal outlining the migration strategy, risk assessment, and implementation timeline. The proposal secured buy-in from leadership across multiple departments.',
      'A key part of this effort involved implementing TypeScript project references across the codebase to dramatically improve type-checking performance. This required systematically auditing hundreds of packages to identify and untangle circular dependencies—tedious but essential groundwork that made the migration possible.',
      'Coordination with team leads across Atlassian was critical to manage the rollout and minimize disruption. Given the project\'s visibility, maintaining clear communication channels and ensuring seamless integration with parallel engineering efforts was essential.',
      'Over a focused 2-3 month period, the migration achieved an 8.5x reduction in developer environment startup time. The improvement had an outsized impact given the scale—hundreds of Confluence frontend developers now spend significantly less time waiting and more time building. (Side note: the volume of changes landed me the second highest PR count in the Confluence organization that year, a department of over 200 developers. This was before the advent of ChatGPT.)',
    ],
    impact: '8.5x faster developer environment startup',
    technologies: ['Yarn v2', 'TypeScript', 'Monorepo Architecture', 'Build Tooling'],
  },
  {
    title: 'Social Logins for Crowdicity',
    company: 'Medallia',
    tags: ['Authentication', 'Security', 'Full Stack'],
    summary: 'Shipped OAuth2 social authentication for Google, Facebook, and Twitter/X, including debugging and patching core defects in the underlying PHP library to ensure reliable cross-provider compatibility.',
    description: [
      'Crowdicity was a crowdsourced innovation platform where organizations collect ideas and feedback from their communities. My task was to integrate social login capabilities into this PHP/React/TypeScript application backed by PostgreSQL.',
      'Building reliable authentication required developing a thorough understanding of OAuth2 and each provider\'s implementation nuances. Google, Facebook, and Twitter/X each handle token flows, scope definitions, and callback mechanisms differently—details that matter when things need to work consistently.',
      'During development, I uncovered several bugs in the PHP OAuth2 library causing intermittent authentication failures. Rather than implementing workarounds, I traced through the library source to identify root causes: improper CSRF state validation, flawed token refresh logic, and malformed redirect URI construction.',
      'Patching these library defects was necessary to deliver consistent authentication across all three providers. This meant bridging the gap between the OAuth2 specification\'s ideals and each provider\'s real-world implementation quirks.',
      'The end result eliminated a major source of registration friction, enabling users to sign up with a single click while maintaining security best practices for token storage and session handling.',
    ],
    impact: 'Enabled frictionless authentication for thousands of users',
    technologies: ['OAuth2', 'PHP', 'React', 'TypeScript', 'PostgreSQL'],
  },
  {
    title: 'Aspera on Demand',
    company: 'IBM / Aspera',
    tags: ['Cloud Infrastructure', 'AWS', 'Automation'],
    summary: 'Built and optimized the AWS deployment infrastructure for Aspera on Demand, reducing provisioning time from 3 hours to 12 minutes through architectural improvements to the VM imaging pipeline.',
    description: [
      'For this project, I designed and implemented deployment automation for Aspera on Demand, enabling customers to provision virtual machines pre-configured with Aspera\'s high-speed transfer software. Aspera\'s FASP protocol delivers transfer speeds orders of magnitude faster than TCP, making it the standard for media companies, research institutions, and enterprises moving massive datasets.',
      'The provisioning pipeline was built from scratch: EC2 instance orchestration, EBS volume configuration tuned for I/O performance, S3 integration for transfer endpoints, and automated installation of the Aspera software stack.',
      'After diagnosing a critical bottleneck in the deployment workflow, I re-architected the approach entirely. By shifting software installation into the base AMI and applying only configuration deltas at runtime, deployment time dropped from 3 hours to just 12 minutes—a 15x improvement.',
      'This optimization transformed the customer experience: users could now spin up transfer capacity on-demand, quickly evaluate new Aspera releases, and scale their infrastructure without lengthy provisioning delays. The faster deployments also reduced AWS costs by minimizing billable instance time during setup.',
      'Working on this project gave me deep expertise in AWS infrastructure: EC2 for compute, EBS for persistent storage, S3 for object storage, IAM for fine-grained access control, and CloudFormation for repeatable infrastructure-as-code deployments.',
    ],
    impact: '15x faster deployment (3 hours → 12 minutes)',
    technologies: ['AWS EC2', 'AWS EBS', 'AWS S3', 'Shell Scripting', 'CloudFormation'],
  },
];

const ROTATIONS = [-1, 1, -1];

function ProjectIconDisplay({ title }) {
  const iconColor = 'var(--color-text-secondary)';

  if (title === 'Bolt to Yarn Migration') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, opacity: 0.6 }}>
        <Box component="span" sx={{ fontSize: '1.5rem', lineHeight: 1, filter: 'grayscale(1)' }}>⚡</Box>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={iconColor}>
          <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z" />
        </svg>
      </Box>
    );
  }

  if (title === 'Social Logins for Crowdicity') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0, color: iconColor }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" opacity="0.7" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.85" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" opacity="0.6" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Box>
    );
  }

  if (title === 'Aspera on Demand') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0, color: iconColor }}>
        <Box
          component="img"
          src={asperaLogo}
          alt="Aspera"
          sx={{
            height: 20,
            width: 'auto',
            filter: 'brightness(0) opacity(0.45)',
            '[data-mui-color-scheme="dark"] &': {
              filter: 'brightness(0) invert(1) opacity(0.45)',
            },
          }}
        />
      </Box>
    );
  }

  return null;
}

function ProjectCard({ project, index, isVisible }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const rotate = ROTATIONS[index % ROTATIONS.length];

  return (
    <StampCard
      rotate={rotate}
      sx={{
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s var(--ease-out-expo) ${0.1 + index * 0.1}s`,
        p: 0,
        '&:hover': {
          transform: `rotate(${rotate}deg)`,
          boxShadow: '4px 4px 0 0 var(--color-ink)',
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderBottom: '2px solid var(--color-ink)',
          backgroundColor: 'var(--color-cream)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ mb: 1.25 }}>
              <MonoLabel color="var(--color-blue)">{project.company}</MonoLabel>
            </Box>
            <Typography
              component="h3"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '1.5rem', md: '1.875rem' },
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--color-ink)',
                lineHeight: 1.05,
              }}
            >
              {project.title}
            </Typography>
          </Box>
          <ProjectIconDisplay title={project.title} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {project.tags.map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 1.25,
                py: 0.25,
                border: '1.5px solid var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-ink)',
                backgroundColor: 'var(--color-paper)',
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--color-ink)',
            lineHeight: 1.65,
            mb: 3,
          }}
        >
          {project.summary}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Sticker color="coral" rotate={3}>{project.impact}</Sticker>
        </Box>

        <Box
          sx={{
            maxHeight: isExpanded ? '2000px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.5s var(--ease-out-expo)',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <Box sx={{ pt: 2, borderTop: '2px solid var(--color-ink)' }}>
            {project.description.map((paragraph, idx) => (
              <Typography
                key={idx}
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.75,
                  mb: 2,
                  '&:last-child': { mb: 0 },
                }}
              >
                {paragraph}
              </Typography>
            ))}

            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid var(--color-border)' }}>
              <Box sx={{ mb: 1.5 }}>
                <MonoLabel color="var(--color-text-secondary)">Technologies Used</MonoLabel>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {project.technologies.map((tech) => (
                  <Box
                    key={tech}
                    sx={{
                      px: 1.25,
                      py: 0.25,
                      backgroundColor: 'var(--color-cream)',
                      border: '1.5px solid var(--color-ink)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          component="button"
          onClick={() => startTransition(() => setIsExpanded(!isExpanded))}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 3,
            px: 0,
            py: 0.5,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-coral)',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'var(--color-ink)',
            },
          }}
        >
          {isExpanded ? 'Show less' : 'Read more'}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            ↓
          </Box>
        </Box>
      </Box>
    </StampCard>
  );
}

export default function PortfolioPage(props) {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="noise-overlay">
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            py: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-paper)',
            borderBottom: '2px solid var(--color-ink)',
          }}
        >
          <IconButton
            component={Link}
            to="/"
            sx={{
              color: 'var(--color-ink)',
              borderRadius: '2px',
              '&:hover': {
                color: 'var(--color-coral)',
                backgroundColor: 'transparent',
              },
            }}
            aria-label="Back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'none', '@media (min-width: 600px)': { display: 'block' } }}>
            <MonoLabel color="var(--color-ink)">WORK · PORTFOLIO</MonoLabel>
          </Box>
          <ColorModeIconDropdown />
        </Box>

        <Box
          component="main"
          ref={sectionRef}
          sx={{
            pt: { xs: 11, md: 13 },
            pb: { xs: 8, md: 12 },
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <MastheadBar left="WORK · PORTFOLIO" right="JONATHAN YEN" />
            </Box>

            <Box
              sx={{
                mb: { xs: 6, md: 8 },
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s var(--ease-out-expo)',
              }}
            >
              <Box sx={{ mb: 2 }}>
                <MonoLabel prefix="01 —" color="var(--color-coral)">Projects</MonoLabel>
              </Box>
              <Typography
                component="h1"
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontSize: { xs: '2.75rem', md: '4.25rem' },
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: '-0.05em',
                  color: 'var(--color-ink)',
                  mb: 2,
                }}
              >
                Selected Work.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AccentRule color="var(--color-blue)" width={48} />
                <MonoLabel color="var(--color-blue)">Three deep cuts</MonoLabel>
              </Box>
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  color: 'var(--color-text-secondary)',
                  maxWidth: 600,
                }}
              >
                A selection of projects where I&rsquo;ve driven significant technical initiatives,
                from infrastructure optimization to developer experience improvements.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 5, md: 7 },
                maxWidth: 900,
                mx: 'auto',
              }}
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </Box>

            <Box
              sx={{
                mt: { xs: 7, md: 9 },
                textAlign: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s var(--ease-out-expo) 0.5s',
              }}
            >
              <MonoLabel prefix="●" color="var(--color-coral)">
                More projects available upon request
              </MonoLabel>
            </Box>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}
```

- [ ] **Step 2: Smoke-test the entire `/portfolio` route**

Run: `npm start`. Open `http://localhost:3000/portfolio`. Confirm:
- Fixed top bar: back arrow, `WORK · PORTFOLIO` mono label (md+), color mode dropdown.
- Masthead bar shows `WORK · PORTFOLIO` left / `JONATHAN YEN` right.
- "01 — Projects" mono eyebrow in coral.
- Title `Selected Work.` in Inter Tight 900.
- Three `StampCard` projects with rotations -1°, 1°, -1°.
- Each card header on cream background with mono company label, large title, and tag pills with hard ink borders.
- "Read more" expands into description paragraphs; technologies render as mono uppercase pills.
- Coral impact `Sticker` on each card.
- Test light and dark mode.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio/PortfolioPage.js
git commit -m "portfolio page: zine reskin with mastheadbar, sticker impact, mono tags"
```

---

### Task 16: Cleanup verification

**Files:**
- No file changes expected. This task is verification + cleanup if grep finds straggling references.

- [ ] **Step 1: Grep for removed tokens**

Run from the repository root:

```bash
grep -rn "color-gold\|color-navy\|Clash Display\|Satoshi\|color-paper-rgb\|color-gold-rgb" src/
```

Expected: zero output. If any line is returned, edit the offending file to remove the reference. Examples that may surface (and how to handle):
- A reference to `'rgba(var(--color-paper-rgb, 250, 248, 245), 0.85)'` — replace with `'var(--color-paper)'` or a hard hex.
- A leftover `'var(--color-gold)'` — replace with `'var(--color-coral)'` (sticker/accent) or `'var(--color-blue)'` (label) per the design intent in that spot.

If you fix anything, re-run the grep until it returns zero lines.

- [ ] **Step 2: Full route smoke test (light + dark)**

Run: `npm start`. In one browser, walk:
1. `/` — Hero, About, Experience, Portfolio, FunFacts, Contact, Footer. Scroll triggers fade-up animations. Header scrolled state has hard ink border.
2. `/travel` — masthead, passport card, world map (visited blue, hover coral stroke), country stamps grid.
3. `/portfolio` — masthead, three project StampCards, expand/collapse on "Read more", impact stickers visible.

Then toggle dark mode via the header dropdown and walk the three routes again. Confirm:
- Paper goes deep ink-blue (`#0e1116`), text goes cream (`#f4ede0`).
- Blue + coral accents remain legible.
- Stickers, mono labels, hard borders all read correctly.
- Calendly URL (`/schedule`) and resume URL (`/resume`) still respond (they redirect via `public/` files; not part of the React render).

Stop the dev server.

- [ ] **Step 3: Confirm production build**

Run: `npm run build`
Expected: build completes with no errors. There may be lint warnings; treat any new ones introduced by this work as fixable.

- [ ] **Step 4: Commit any straggler fixes (if any)**

If Step 1 or Step 2 forced edits, commit:

```bash
git add -A
git commit -m "theme: remove last references to removed tokens"
```

If nothing changed, skip this step.

- [ ] **Step 5: Final repo status check**

```bash
git status
```
Expected: clean working tree. All commits land on the current branch.

---

## Notes on test coverage

This codebase contains no Jest or React Testing Library specs for the visual components. Adding new component-level tests for the zine primitives would be reasonable future work, but is **out of scope** for this redesign — the spec is explicit that automated visual tests are not added in this pass. Verification per task is via the `npm start` smoke checks described in each task.

The `App.test.js` file ships with Create React App's default render test. After Task 1 and Task 2 it should still pass; if it breaks, fix the test rather than skip it. Run:

```bash
CI=true npm test
```
once at the end of the work and resolve any failures before declaring the redesign complete.
