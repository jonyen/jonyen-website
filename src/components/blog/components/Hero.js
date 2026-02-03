import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

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
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 0 },
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: { xs: '300px', md: '500px' },
          height: { xs: '300px', md: '500px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-gold-dim) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: { xs: '200px', md: '400px' },
          height: { xs: '200px', md: '400px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-gold-dim) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: '900px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <Box
            className="animate-in"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              px: 2,
              py: 1,
              borderRadius: '100px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-cream)',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <AccountBalanceIcon
              sx={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Washington DC Metro
            </Typography>
          </Box>

          {/* Main heading */}
          <Typography
            component="h1"
            className="animate-in animate-delay-1"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' },
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              mb: 3,
            }}
          >
            Jonathan Yen
          </Typography>

          {/* Subtitle with animated line */}
          <Box className="animate-in animate-delay-2" sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: 'var(--color-gold)',
                  animation: 'drawLine 0.8s ease-out 0.6s forwards',
                  transformOrigin: 'left',
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 500,
                  color: 'var(--color-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                Full Stack Engineer
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: { xs: '1.125rem', md: '1.375rem' },
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '600px',
              }}
            >
              15+ years writing software for industry-leading companies.
              UC Berkeley alumnus with a passion for building elegant solutions to complex problems.
            </Typography>
          </Box>

          {/* Stats row */}
          <Box
            className="animate-in animate-delay-3"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 3, md: 5 },
              mb: 5,
            }}
          >
          </Box>

          {/* CTA Button */}
          <Box className="animate-in animate-delay-4">
            <Button
              onClick={scrollToAbout}
              endIcon={<ArrowDownwardIcon />}
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'var(--color-ink)',
                backgroundColor: 'transparent',
                border: '2px solid var(--color-ink)',
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                  transform: 'translateY(-2px)',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateY(3px)',
                  },
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              Explore My Journey
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 30, md: 50 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          animation: 'fadeIn 1s ease 1.5s forwards',
          opacity: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          Scroll
        </Typography>
        <Box
          sx={{
            width: 1,
            height: 40,
            backgroundColor: 'var(--color-text-secondary)',
            animation: 'scrollLine 1.5s ease-in-out infinite',
            transformOrigin: 'top',
            '@keyframes scrollLine': {
              '0%': { transform: 'scaleY(0)', opacity: 0 },
              '50%': { transform: 'scaleY(1)', opacity: 1 },
              '100%': { transform: 'scaleY(0)', opacity: 0, transformOrigin: 'bottom' },
            },
          }}
        />
      </Box>
    </Box>
  );
}
