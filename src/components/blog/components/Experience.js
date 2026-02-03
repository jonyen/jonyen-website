import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import mercorLogo from '../../../assets/mercor-logo.png';
import atlassianLogo from '../../../assets/atlassian-logo.svg';
import medalliaLogo from '../../../assets/medallia-logo.png';
import cventLogo from '../../../assets/cvent-logo.png';
import ibmLogo from '../../../assets/IBM-8-bar-logo.svg';
import asperaLogo from '../../../assets/aspera-seeklogo.png';

const companies = [
  {
    name: 'Mercor',
    logo: mercorLogo,
    role: 'Senior Domain Expert (Software Developer)',
    period: '2025 - Current',
    description: 'Building AI-powered tools for the construction industry.',
    href: 'https://mercor.com',
    highlights: [
      'Developed 0→1 projects to help train AI models',
      'Built tools to improve expert workflows and productivity',
      'Collaborated with a top AI research lab',
    ],
  },
  {
    name: 'Atlassian',
    logo: atlassianLogo,
    role: 'Senior Software Engineer',
    period: '2022 - 2025',
    description: 'Building collaboration tools that power teams worldwide.',
    href: 'https://atlassian.com',
    highlights: [
      'Led team to build new search experience for Rovo (Atlassian AI)',
      'Led migration of Confluence frontend tooling from Bolt to Yarn, a multi-month cross-team collaboration effort',],
  },
  {
    name: 'Medallia',
    logo: medalliaLogo,
    role: 'Software Engineer',
    period: 'Previous',
    description: 'Customer experience management platform.',
    href: 'https://medallia.com',
    highlights: [
      'Implemented social logins (Google, Facebook, Twitter/X)',
      'Served as security champion for the team',
      'Built analytics dashboard and accessibility best practices',
      'Dockerized developer environment',
    ],
  },
  {
    name: 'Cvent',
    logo: cventLogo,
    role: 'Software Engineer',
    period: 'Previous',
    description: 'Event management and hospitality technology.',
    href: 'https://cvent.com',
  },
  {
    name: 'IBM',
    logo: ibmLogo,
    role: 'Software Engineer',
    period: 'Previous',
    description: 'Enterprise technology and consulting.',
    href: 'https://ibm.com',
    highlights: [
      'Sped up Aspera on Demand (AWS Marketplace) deployment by 12x',
      'Enhanced JavaScript library to support batch operations',
    ],
  },
  {
    name: 'Aspera',
    logo: asperaLogo,
    role: 'Software Engineer',
    period: 'Previous',
    description: 'High-speed file transfer technology (acquired by IBM).',
    href: 'https://ibm.com/aspera',
  },
];

function CompanyCard({ company, index, isVisible }) {
  const { mode } = useColorScheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Box
      component="a"
      href={company.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 4 },
        p: { xs: 3, md: 4 },
        textDecoration: 'none',
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0)'
          : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.08}s`,
        '&:hover': {
          borderColor: 'var(--color-gold)',
          boxShadow: '0 20px 40px -20px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 80, md: 100 },
          height: { xs: 40, md: 50 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Box
          component="img"
          src={company.logo}
          alt={`${company.name} logo`}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: mode === 'dark'
              ? 'grayscale(100%) invert(1) brightness(1)'
              : 'grayscale(100%)',
            opacity: isHovered ? 1 : 0.6,
            transition: 'all 0.3s ease',
            ...(isHovered && {
              filter: 'none',
              opacity: 1,
            }),
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 600,
              color: 'var(--color-ink)',
              transition: 'color 0.2s ease',
              ...(isHovered && {
                color: 'var(--color-gold)',
              }),
            }}
          >
            {company.name}
          </Typography>
          {company.period === 'Current' && (
            <Box
              sx={{
                px: 1.5,
                py: 0.25,
                borderRadius: '100px',
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-paper)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.625rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Current
            </Box>
          )}
        </Box>
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            mb: 0.5,
          }}
        >
          {company.role}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            opacity: 0.7,
            display: { xs: 'none', md: 'block' },
          }}
        >
          {company.description}
        </Typography>
        {company.highlights && company.highlights.length > 0 && (
          <Box
            component="ul"
            sx={{
              mt: 1.5,
              pl: 2,
              m: 0,
              listStyle: 'none',
              display: { xs: 'none', md: 'block' },
            }}
          >
            {company.highlights.map((highlight, idx) => (
              <Box
                component="li"
                key={idx}
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  opacity: 0.8,
                  py: 0.25,
                  position: 'relative',
                  wordWrap: 'break-word',
                  maxWidth: '50ch',
                  '&::before': {
                    content: '"→"',
                    position: 'absolute',
                    left: -16,
                    color: 'var(--color-gold)',
                    opacity: 0.7,
                  },
                }}
              >
                {highlight}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Arrow */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
          transition: 'all 0.3s ease',
          ...(isHovered && {
            borderColor: 'var(--color-gold)',
            color: 'var(--color-gold)',
            transform: 'translateX(4px)',
          }),
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8H13M13 8L9 4M13 8L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>
    </Box>
  );
}

export default function Experience() {
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
      id="experience"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-paper)',
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
            02 / Experience
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
            Where I've worked
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
            From startups to enterprise, building products that scale.
          </Typography>
        </Box>

        {/* Company cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          {companies.map((company, index) => (
            <CompanyCard
              key={company.name}
              company={company}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
