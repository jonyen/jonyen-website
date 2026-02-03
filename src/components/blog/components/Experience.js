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
    name: 'Aspera',
    logo: asperaLogo,
    years: '2011 - 2015',
    href: 'https://ibm.com/aspera',
  },
  {
    name: 'IBM',
    logo: ibmLogo,
    years: '2015 - 2019',
    href: 'https://ibm.com',
  },
  {
    name: 'Cvent',
    logo: cventLogo,
    years: '2019 - 2020',
    href: 'https://cvent.com',
  },
  {
    name: 'Medallia',
    logo: medalliaLogo,
    years: '2020 - 2022',
    href: 'https://medallia.com',
  },
  {
    name: 'Atlassian',
    logo: atlassianLogo,
    years: '2022 - 2025',
    href: 'https://atlassian.com',
  },
  {
    name: 'Mercor',
    logo: mercorLogo,
    years: '2025 - Current',
    href: 'https://mercor.com',
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
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: { xs: 2, md: 3 },
        textDecoration: 'none',
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0)'
          : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.05}s`,
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
          width: { xs: 60, md: 80 },
          height: { xs: 30, md: 40 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
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
      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '1rem', md: '1.125rem' },
          fontWeight: 600,
          color: 'var(--color-ink)',
          transition: 'color 0.2s ease',
          mb: 0.5,
          ...(isHovered && {
            color: 'var(--color-gold)',
          }),
        }}
      >
        {company.name}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: { xs: '0.75rem', md: '0.8125rem' },
          color: 'var(--color-text-secondary)',
        }}
      >
        {company.years}
      </Typography>
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
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
            gap: { xs: 2, md: 3 },
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
