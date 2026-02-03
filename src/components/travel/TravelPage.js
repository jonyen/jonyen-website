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
import CountryStamps from './components/CountryStamps';

export default function TravelPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="noise-overlay">
        {/* Navigation bar */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            py: 2,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(var(--color-paper-rgb, 250, 248, 245), 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
            '[data-mui-color-scheme="dark"] &': {
              backgroundColor: 'rgba(10, 22, 40, 0.85)',
            },
          }}
        >
          <IconButton
            component={Link}
            to="/"
            sx={{
              color: 'var(--color-ink)',
              '&:hover': {
                backgroundColor: 'var(--color-gold-dim)',
                color: 'var(--color-gold)',
              },
            }}
            aria-label="Back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <ColorModeIconDropdown />
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            pt: { xs: 10, md: 12 },
            pb: { xs: 6, md: 10 },
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="lg">
            {/* Passport-style container */}
            <Box
              sx={{
                backgroundColor: 'var(--color-paper)',
                borderRadius: 4,
                border: '3px solid var(--color-gold)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                // Passport texture overlay
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(var(--color-gold-rgb, 196, 155, 68), 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(var(--color-gold-rgb, 196, 155, 68), 0.03) 0%, transparent 50%)
                  `,
                  pointerEvents: 'none',
                },
              }}
            >
              {/* Inner border decoration */}
              <Box
                sx={{
                  m: { xs: 1.5, md: 3 },
                  p: { xs: 2, md: 4 },
                  border: '1px solid var(--color-border)',
                  borderRadius: 3,
                  position: 'relative',
                }}
              >
                <PassportHeader />
                <WorldMap />
                <CountryStamps />

                {/* Footer decoration */}
                <Box
                  sx={{
                    mt: { xs: 4, md: 6 },
                    pt: 3,
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 3,
                      py: 1,
                      backgroundColor: 'var(--color-gold-dim)',
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-gold)',
                      }}
                    />
                    <Box
                      component="span"
                      sx={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      More adventures to come
                    </Box>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-gold)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}
