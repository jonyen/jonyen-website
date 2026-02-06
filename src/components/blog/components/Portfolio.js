import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import asperaLogo from '../../../assets/aspera-seeklogo.png';

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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.374 6.18 6.18 0 0 1-.248-.467c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.395 6.395 0 0 0-.863.279 2.003 2.003 0 0 1-.248.088c-.08 0-.12-.055-.12-.176v-.391c0-.088.008-.152.032-.191a.36.36 0 0 1 .12-.127 6.6 6.6 0 0 1 1.004-.36 4.662 4.662 0 0 1 1.243-.16c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586zm-3.504 1.14c.263 0 .534-.047.822-.143.287-.096.543-.271.758-.51a1.2 1.2 0 0 0 .32-.527c.055-.191.088-.423.088-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.295.782.311zm6.343.36a.477.477 0 0 1-.255-.064c-.08-.04-.136-.12-.168-.24L7.36 5.39a1.007 1.007 0 0 1-.048-.24c0-.096.048-.148.144-.148h.782c.135 0 .224.016.272.064.08.04.128.12.16.24l1.342 5.284 1.245-5.284c.024-.128.08-.2.16-.24a.628.628 0 0 1 .28-.064h.638c.136 0 .224.016.28.064.08.04.12.12.152.24l1.261 5.348 1.381-5.348c.032-.128.088-.2.16-.24a.555.555 0 0 1 .271-.064h.743c.096 0 .152.048.152.148 0 .032-.008.064-.016.104a.93.93 0 0 1-.032.144l-1.928 5.844c-.032.128-.088.2-.168.24a.565.565 0 0 1-.255.064h-.687c-.136 0-.224-.016-.28-.064-.08-.048-.12-.12-.152-.248l-1.237-5.148-1.23 5.14c-.024.128-.08.2-.159.248-.08.048-.176.064-.28.064h-.687zm10.127.088a4.2 4.2 0 0 1-.99-.12 2.858 2.858 0 0 1-.726-.272c-.12-.072-.2-.152-.232-.232a.578.578 0 0 1-.048-.224v-.407c0-.12.048-.176.136-.176a.347.347 0 0 1 .112.016c.04.016.096.04.16.072.216.104.45.184.694.24.248.056.487.08.735.08.39 0 .694-.072.91-.215.215-.144.327-.35.327-.63a.648.648 0 0 0-.183-.478c-.12-.128-.351-.24-.686-.352l-.99-.31c-.494-.16-.862-.391-1.084-.703a1.628 1.628 0 0 1-.344-1.005c0-.289.064-.543.183-.766.12-.224.28-.415.487-.567a2.17 2.17 0 0 1 .71-.36c.272-.08.567-.12.878-.12.152 0 .312.008.471.032.152.024.296.056.432.088.128.04.248.08.36.128.112.048.2.096.264.144a.608.608 0 0 1 .168.176c.04.064.056.144.056.248v.375c0 .12-.048.184-.136.184a.594.594 0 0 1-.216-.08 2.546 2.546 0 0 0-1.085-.232c-.35 0-.63.056-.822.176-.192.12-.288.303-.288.558 0 .192.072.359.216.495.144.136.407.272.782.398l.966.303c.487.152.846.367 1.068.647.224.272.336.59.336.958 0 .296-.064.567-.183.806a1.836 1.836 0 0 1-.511.607c-.216.168-.479.296-.782.383-.312.096-.647.144-1.012.144zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.248-.224-.024-.527.271-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.288.384.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.191-.064-.359 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.216.184-.423.088-.327-.152.32-.79 1.03-2.57.696-2.994z" />
        </svg>
      </Box>
    );
  }

  return null;
}

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
      {/* Company + Icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {project.company}
        </Typography>
        <ProjectIconDisplay title={project.title} />
      </Box>

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
