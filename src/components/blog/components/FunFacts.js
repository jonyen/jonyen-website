import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PublicIcon from '@mui/icons-material/Public';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ExtensionIcon from '@mui/icons-material/Extension';
import { getDaysSince } from '../../../utils/dateUtils';

const facts = [
  {
    icon: DirectionsRunIcon,
    number: '4',
    label: 'Marathons',
    description: 'Plus countless half-marathons',
    color: '#e74c3c',
  },
  {
    icon: PublicIcon,
    number: '20+',
    label: 'Countries',
    description: 'Across 4 continents',
    color: '#3498db',
  },
  {
    icon: LocalCafeIcon,
    number: '0',
    label: 'Cups of Coffee',
    description: 'Ever. Seriously.',
    color: '#9b59b6',
  },
  {
    icon: ExtensionIcon,
    number: getDaysSince('2020-03-23').toLocaleString(),
    label: 'Day Crossword Streak',
    description: 'NY Times, since COVID lockdown',
    color: '#27ae60',
  },
];

function FactCard({ fact, index, isVisible }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const Icon = fact.icon;

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        p: { xs: 3, md: 4 },
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'default',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.12)',
          borderColor: fact.color,
        },
      }}
    >
      {/* Background gradient on hover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at top right, ${fact.color}10 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '16px',
          backgroundColor: `${fact.color}15`,
          color: fact.color,
          mb: 3,
          transition: 'all 0.3s ease',
          ...(isHovered && {
            transform: 'scale(1.1) rotate(-5deg)',
          }),
        }}
      >
        <Icon sx={{ fontSize: 28 }} />
      </Box>

      {/* Number */}
      <Typography
        sx={{
          position: 'relative',
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '2.5rem', md: '3rem' },
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--color-ink)',
          mb: 1,
          transition: 'color 0.3s ease',
          ...(isHovered && {
            color: fact.color,
          }),
        }}
      >
        {fact.number}
      </Typography>

      {/* Label */}
      <Typography
        sx={{
          position: 'relative',
          fontFamily: 'var(--font-display)',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--color-ink)',
          mb: 1,
        }}
      >
        {fact.label}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          position: 'relative',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}
      >
        {fact.description}
      </Typography>
    </Box>
  );
}

export default function FunFacts() {
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
      id="fun-facts"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-cream)',
        position: 'relative',
      }}
    >
      {/* Decorative element */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '60%',
          background: 'radial-gradient(ellipse, var(--color-gold-dim) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Section header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              mb: 2,
            }}
          >
            03 / Beyond Code
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              mb: 2,
            }}
          >
            Fun facts about me
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            There's more to life than just code.
          </Typography>
        </Box>

        {/* Facts grid */}
        <Grid container spacing={3}>
          {facts.map((fact, index) => (
            <Grid key={fact.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <FactCard fact={fact} index={index} isVisible={isVisible} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
