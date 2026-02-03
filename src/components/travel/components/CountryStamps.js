import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// Country data with regions
const countries = [
  // Asia
  { name: 'Thailand', region: 'Asia', flag: '🇹🇭' },
  { name: 'Cambodia', region: 'Asia', flag: '🇰🇭' },
  { name: 'Vietnam', region: 'Asia', flag: '🇻🇳' },
  { name: 'Malaysia', region: 'Asia', flag: '🇲🇾' },
  { name: 'Taiwan', region: 'Asia', flag: '🇹🇼' },
  { name: 'China', region: 'Asia', flag: '🇨🇳' },
  { name: 'South Korea', region: 'Asia', flag: '🇰🇷' },
  { name: 'Singapore', region: 'Asia', flag: '🇸🇬' },
  { name: 'Japan', region: 'Asia', flag: '🇯🇵' },
  // Americas
  { name: 'Canada', region: 'Americas', flag: '🇨🇦' },
  { name: 'Mexico', region: 'Americas', flag: '🇲🇽' },
  // Oceania
  { name: 'Australia', region: 'Oceania', flag: '🇦🇺' },
  // Europe
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

const regionColors = {
  Asia: { bg: 'hsl(350, 70%, 95%)', border: 'hsl(350, 60%, 60%)', text: 'hsl(350, 60%, 40%)' },
  Europe: { bg: 'hsl(220, 70%, 95%)', border: 'hsl(220, 60%, 60%)', text: 'hsl(220, 60%, 40%)' },
  Americas: { bg: 'hsl(145, 60%, 94%)', border: 'hsl(145, 50%, 50%)', text: 'hsl(145, 50%, 35%)' },
  Oceania: { bg: 'hsl(30, 80%, 94%)', border: 'hsl(30, 70%, 55%)', text: 'hsl(30, 70%, 40%)' },
};

function StampCard({ country, index }) {
  const colors = regionColors[country.region];
  const rotation = (index % 7 - 3) * 2; // Random-ish rotation between -6 and 6 degrees

  return (
    <Box
      sx={{
        position: 'relative',
        p: { xs: 2, md: 2.5 },
        backgroundColor: colors.bg,
        border: `2px dashed ${colors.border}`,
        borderRadius: 2,
        transform: `rotate(${rotation}deg)`,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
        '&:hover': {
          transform: 'rotate(0deg) scale(1.05)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        },
        // Stamp perforated edge effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -4,
          left: 8,
          right: 8,
          height: 8,
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 4px,
            ${colors.bg} 4px,
            ${colors.bg} 8px
          )`,
          borderRadius: '0 0 4px 4px',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -4,
          left: 8,
          right: 8,
          height: 8,
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 4px,
            ${colors.bg} 4px,
            ${colors.bg} 8px
          )`,
          borderRadius: '4px 4px 0 0',
        },
      }}
    >
      {/* Country flag */}
      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          lineHeight: 1,
          mb: 1,
          textAlign: 'center',
        }}
      >
        {country.flag}
      </Typography>

      {/* Country name */}
      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          fontWeight: 600,
          color: colors.text,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 1.2,
        }}
      >
        {country.name}
      </Typography>

      {/* Region badge */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.625rem',
          color: colors.border,
          textAlign: 'center',
          mt: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {country.region}
      </Typography>

      {/* Stamp circle decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: `1.5px solid ${colors.border}`,
          opacity: 0.5,
        }}
      />
    </Box>
  );
}

export default function CountryStamps() {
  const regions = ['Asia', 'Europe', 'Americas', 'Oceania'];

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      {/* Section header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="overline"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'var(--color-text-secondary)',
            display: 'block',
            mb: 1,
          }}
        >
          Collection
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 600,
            color: 'var(--color-ink)',
          }}
        >
          Passport Stamps
        </Typography>
      </Box>

      {/* Region legend */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 2, md: 3 },
          mb: { xs: 4, md: 5 },
        }}
      >
        {regions.map((region) => {
          const colors = regionColors[region];
          const count = countries.filter((c) => c.region === region).length;
          return (
            <Box
              key={region}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: colors.bg,
                borderRadius: 2,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: colors.border,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text,
                }}
              >
                {region}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: colors.border,
                }}
              >
                ({count})
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Stamps grid */}
      <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
        {countries.map((country, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={country.name}>
            <StampCard country={country} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
