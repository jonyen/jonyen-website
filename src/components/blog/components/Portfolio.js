import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

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

function ProjectCard({ project, index, isVisible }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Box
      component={Link}
      to="/portfolio"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'block',
        textDecoration: 'none',
        p: { xs: 3, md: 4 },
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.08}s`,
        '&:hover': {
          borderColor: 'var(--color-gold)',
          boxShadow: '0 20px 40px -20px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Company */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          mb: 1,
        }}
      >
        {project.company}
      </Typography>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '1.25rem', md: '1.375rem' },
          fontWeight: 600,
          color: 'var(--color-ink)',
          mb: 1,
          transition: 'color 0.2s ease',
          ...(isHovered && {
            color: 'var(--color-gold)',
          }),
        }}
      >
        {project.title}
      </Typography>

      {/* Summary */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          mb: 2,
        }}
      >
        {project.summary}
      </Typography>

      {/* Impact badge */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.5,
          backgroundColor: 'var(--color-gold-dim)',
          borderRadius: '6px',
          mb: 2,
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
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-gold)',
          }}
        >
          {project.impact}
        </Typography>
      </Box>

      {/* Tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {project.tags.map((tag) => (
          <Box
            key={tag}
            sx={{
              px: 1.5,
              py: 0.25,
              borderRadius: '100px',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {tag}
          </Box>
        ))}
      </Box>
    </Box>
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
            03 / Featured Work
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
            Project highlights
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
            A few initiatives where I drove meaningful technical impact.
          </Typography>
        </Box>

        {/* Project cards grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            maxWidth: 1000,
            mx: 'auto',
            mb: { xs: 4, md: 6 },
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

        {/* View all button */}
        <Box
          sx={{
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          <Button
            component={Link}
            to="/portfolio"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--color-ink)',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-paper)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'var(--color-gold)',
                backgroundColor: 'var(--color-gold-dim)',
                color: 'var(--color-gold)',
              },
            }}
          >
            View full portfolio
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
