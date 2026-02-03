import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function PassportHeader() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 4, md: 6 },
        position: 'relative',
      }}
    >
      {/* Decorative top border */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: { xs: 40, md: 80 },
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--color-gold))',
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid var(--color-gold)',
          }}
        />
        <Box
          sx={{
            width: { xs: 40, md: 80 },
            height: 2,
            background: 'linear-gradient(90deg, var(--color-gold), transparent)',
          }}
        />
      </Box>

      {/* Passport emblem */}
      <Box
        sx={{
          width: { xs: 60, md: 80 },
          height: { xs: 60, md: 80 },
          mx: 'auto',
          mb: 2,
          borderRadius: '50%',
          border: '3px solid var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 4,
            borderRadius: '50%',
            border: '1px solid var(--color-gold)',
            opacity: 0.5,
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 700,
            color: 'var(--color-gold)',
          }}
        >
          JY
        </Typography>
      </Box>

      {/* Main title */}
      <Typography
        variant="overline"
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '0.65rem', md: '0.75rem' },
          letterSpacing: '0.4em',
          color: 'var(--color-text-secondary)',
          display: 'block',
          mb: 1,
        }}
      >
        Travel Record
      </Typography>

      <Typography
        variant="h1"
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
          fontWeight: 700,
          color: 'var(--color-ink)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          mb: 1,
        }}
      >
        Passport
      </Typography>

      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: { xs: '1rem', md: '1.125rem' },
          color: 'var(--color-text-secondary)',
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        23 countries explored and counting
      </Typography>

      {/* Decorative bottom border */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mt: 3,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: i === 2 ? 'var(--color-gold)' : 'transparent',
              border: '1px solid var(--color-gold)',
              opacity: i === 2 ? 1 : 0.5,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
