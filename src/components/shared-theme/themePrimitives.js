import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

const customShadows = [...defaultTheme.shadows];

// Editorial color palette
export const brand = {
  50: 'hsl(43, 55%, 95%)',
  100: 'hsl(43, 55%, 88%)',
  200: 'hsl(43, 55%, 75%)',
  300: 'hsl(43, 55%, 60%)',
  400: 'hsl(43, 71%, 43%)', // Gold accent
  500: 'hsl(43, 71%, 38%)',
  600: 'hsl(43, 71%, 32%)',
  700: 'hsl(43, 71%, 25%)',
  800: 'hsl(43, 71%, 18%)',
  900: 'hsl(43, 71%, 12%)',
};

export const gray = {
  50: 'hsl(220, 20%, 97%)',
  100: 'hsl(220, 20%, 94%)',
  200: 'hsl(220, 15%, 88%)',
  300: 'hsl(220, 15%, 80%)',
  400: 'hsl(220, 15%, 60%)',
  500: 'hsl(220, 15%, 45%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 25%, 25%)',
  800: 'hsl(220, 35%, 12%)',
  900: 'hsl(220, 40%, 6%)',
};

export const green = {
  50: 'hsl(145, 60%, 96%)',
  100: 'hsl(145, 55%, 90%)',
  200: 'hsl(145, 50%, 80%)',
  300: 'hsl(145, 45%, 65%)',
  400: 'hsl(145, 50%, 45%)',
  500: 'hsl(145, 55%, 35%)',
  600: 'hsl(145, 60%, 28%)',
  700: 'hsl(145, 65%, 20%)',
  800: 'hsl(145, 70%, 14%)',
  900: 'hsl(145, 75%, 8%)',
};

export const orange = {
  50: 'hsl(30, 100%, 96%)',
  100: 'hsl(30, 95%, 88%)',
  200: 'hsl(30, 90%, 76%)',
  300: 'hsl(30, 85%, 62%)',
  400: 'hsl(30, 80%, 48%)',
  500: 'hsl(30, 85%, 40%)',
  600: 'hsl(30, 90%, 32%)',
  700: 'hsl(30, 95%, 24%)',
  800: 'hsl(30, 100%, 18%)',
  900: 'hsl(30, 100%, 12%)',
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

export const getDesignTokens = (mode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.05) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.05) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[600],
        contrastText: '#faf8f5',
        ...(mode === 'dark' && {
          contrastText: '#0a1628',
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
        default: '#faf8f5',
        paper: '#f5f2ed',
        ...(mode === 'dark' && {
          default: '#0a1628',
          paper: '#111d32'
        }),
      },
      text: {
        primary: '#0a1628',
        secondary: '#5a6478',
        warning: orange[400],
        ...(mode === 'dark' && {
          primary: '#faf8f5',
          secondary: '#9ba3b5',
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
      fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontFamily: "'Clash Display', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(64),
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontFamily: "'Clash Display', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: "'Clash Display', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: "'Clash Display', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(28),
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h5: {
        fontFamily: "'Clash Display', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(22),
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: "'Clash Display', sans-serif",
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
        lineHeight: 1.5,
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
        lineHeight: 1.7,
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        lineHeight: 1.6,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 500,
        letterSpacing: '0.02em',
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
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
        contrastText: '#faf8f5',
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
        default: '#faf8f5',
        paper: '#f5f2ed',
      },
      text: {
        primary: '#0a1628',
        secondary: '#5a6478',
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: alpha(gray[200], 0.3),
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.05) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: '#0a1628',
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
        default: '#0a1628',
        paper: '#111d32',
      },
      text: {
        primary: '#faf8f5',
        secondary: '#9ba3b5',
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif",
  h1: {
    fontFamily: "'Clash Display', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(64),
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '-0.03em',
  },
  h2: {
    fontFamily: "'Clash Display', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontFamily: "'Clash Display', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontFamily: "'Clash Display', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(28),
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h5: {
    fontFamily: "'Clash Display', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(22),
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: "'Clash Display', sans-serif",
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
    lineHeight: 1.5,
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
    lineHeight: 1.7,
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    lineHeight: 1.6,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  button: {
    fontWeight: 500,
    textTransform: 'none',
  },
};

export const shape = {
  borderRadius: 12,
};

const defaultShadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];

export const shadows = defaultShadows;
