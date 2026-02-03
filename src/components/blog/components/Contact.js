import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const contactLinks = [
  {
    icon: CalendarMonthIcon,
    label: 'Schedule a Call',
    description: 'Book a time that works for you',
    href: '/schedule',
    primary: true,
  },
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    description: 'Let\'s connect professionally',
    href: 'https://www.linkedin.com/in/jonyen/',
  },
  {
    icon: GitHubIcon,
    label: 'GitHub',
    description: 'Check out my open source work',
    href: 'https://github.com/jonyen',
  },
  {
    icon: DescriptionIcon,
    label: 'Resume',
    description: 'Download my full resume',
    href: '/resume',
  },
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
        backgroundColor: 'var(--color-paper)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50%',
          height: '80%',
          background: 'radial-gradient(circle, var(--color-gold-dim) 0%, transparent 60%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Main CTA */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 8, md: 10 },
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
            05 / Get in Touch
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              mb: 3,
            }}
          >
            Let's build something
            <br />
            <Box component="span" sx={{ color: 'var(--color-gold)' }}>
              together
            </Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              mx: 'auto',
              mb: 4,
            }}
          >
            Whether you have a project in mind or just want to chat about tech,
            I'm always happy to connect.
          </Typography>

          {/* Primary CTA */}
          <Button
            href="/schedule"
            endIcon={<ArrowOutwardIcon />}
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'var(--color-paper)',
              backgroundColor: 'var(--color-ink)',
              borderRadius: '100px',
              px: 5,
              py: 2,
              transition: 'all 0.3s ease',
              '[data-mui-color-scheme="dark"] &': {
                color: 'var(--color-ink)',
                backgroundColor: 'var(--color-paper)',
                '&:hover': {
                  backgroundColor: 'var(--color-gold)',
                  color: '#0a1628',
                },
              },
              '&:hover': {
                backgroundColor: 'var(--color-gold)',
                color: '#0a1628',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 30px -10px var(--color-gold)',
                '& .MuiSvgIcon-root': {
                  transform: 'translate(3px, -3px)',
                },
              },
              '& .MuiSvgIcon-root': {
                transition: 'transform 0.3s ease',
              },
            }}
          >
            Schedule a Call
          </Button>
        </Box>

        {/* Contact links grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {contactLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Box
                key={link.label}
                component="a"
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : '_self'}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 3,
                  textDecoration: 'none',
                  backgroundColor: 'var(--color-cream)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.08}s`,
                  '&:hover': {
                    borderColor: 'var(--color-gold)',
                    backgroundColor: 'var(--color-gold-dim)',
                    transform: 'translateY(-4px)',
                    '& .contact-icon': {
                      color: 'var(--color-gold)',
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box
                  className="contact-icon"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-paper)',
                    color: 'var(--color-text-secondary)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                      mb: 0.25,
                    }}
                  >
                    {link.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {link.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
