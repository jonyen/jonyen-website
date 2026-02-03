import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const techStack = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js'] },
  { category: 'Backend', items: ['Node.js', 'Ruby on Rails', 'Python'] },
  { category: 'Mobile', items: ['iOS', 'Android'] },
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
      {/* Decorative corner element */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: 100, md: 200 },
          height: { xs: 100, md: 200 },
          borderLeft: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }}>
          {/* Section header */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: { md: 'sticky' },
                top: { md: 120 },
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
                01 / About
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
                }}
              >
                Building the
                <br />
                <Box component="span" sx={{ color: 'var(--color-gold)' }}>
                  digital future
                </Box>
              </Typography>
            </Box>
          </Grid>

          {/* Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                A software engineer by trade, I've worked at industry-leading companies over the
                past 15 years and have collaborated with some of the brightest minds in the industry.
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 400,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  mb: 6,
                }}
              >
                Educated at UC Berkeley, I spent over 10 years in the Bay Area before moving to
                Northern Virginia where I currently reside. Outside of work, I'm a Sunday school
                teacher and I lead my church's children's ministry of over 40 kids along with my wife.
              </Typography>

              {/* Tech stack */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3,
                  pt: 4,
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                {techStack.map((stack, index) => (
                  <Box
                    key={stack.category}
                    sx={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-gold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        mb: 1.5,
                      }}
                    >
                      {stack.category}
                    </Typography>
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
