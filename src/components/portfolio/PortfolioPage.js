import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

const projects = [
  {
    title: 'Bolt to Yarn Migration',
    company: 'Atlassian',
    tags: ['Technical Leadership', 'Developer Experience', 'TypeScript'],
    summary: 'Led a high-visibility, cross-departmental initiative to modernize the Confluence frontend build infrastructure, delivering an 8.5x improvement in developer environment startup time for hundreds of engineers.',
    description: [
      'This project had me owning the end-to-end migration from Bolt—a package management toolkit abandoned by its maintainer for over a year—to Yarn v2. Bolt\'s workspace management capabilities had made it valuable for the Confluence monorepo, but its lack of maintenance had become a liability blocking critical engineering initiatives.',
      'After evaluating alternatives including pnpm and npm, I recommended Yarn v2 and authored a comprehensive technical proposal outlining the migration strategy, risk assessment, and implementation timeline. The proposal secured buy-in from leadership across multiple departments.',
      'A key part of this effort involved implementing TypeScript project references across the codebase to dramatically improve type-checking performance. This required systematically auditing hundreds of packages to identify and untangle circular dependencies—tedious but essential groundwork that made the migration possible.',
      'Coordination with team leads across Atlassian was critical to manage the rollout and minimize disruption. Given the project\'s visibility, maintaining clear communication channels and ensuring seamless integration with parallel engineering efforts was essential.',
      'Over a focused 2-3 month period, the migration achieved an 8.5x reduction in developer environment startup time. The improvement had an outsized impact given the scale—hundreds of Confluence frontend developers now spend significantly less time waiting and more time building. (Side note: the volume of changes landed me the second highest PR count in the Confluence organization that year, a department of over 200 developers. This was before the advent of ChatGPT.)',
    ],
    impact: '8.5x faster developer environment startup',
    technologies: ['Yarn v2', 'TypeScript', 'Monorepo Architecture', 'Build Tooling'],
  },
  {
    title: 'Social Logins for Crowdicity',
    company: 'Medallia',
    tags: ['Authentication', 'Security', 'Full Stack'],
    summary: 'Shipped OAuth2 social authentication for Google, Facebook, and Twitter/X, including debugging and patching core defects in the underlying PHP library to ensure reliable cross-provider compatibility.',
    description: [
      'Crowdicity was a crowdsourced innovation platform where organizations collect ideas and feedback from their communities. My task was to integrate social login capabilities into this PHP/React/TypeScript application backed by PostgreSQL.',
      'Building reliable authentication required developing a thorough understanding of OAuth2 and each provider\'s implementation nuances. Google, Facebook, and Twitter/X each handle token flows, scope definitions, and callback mechanisms differently—details that matter when things need to work consistently.',
      'During development, I uncovered several bugs in the PHP OAuth2 library causing intermittent authentication failures. Rather than implementing workarounds, I traced through the library source to identify root causes: improper CSRF state validation, flawed token refresh logic, and malformed redirect URI construction.',
      'Patching these library defects was necessary to deliver consistent authentication across all three providers. This meant bridging the gap between the OAuth2 specification\'s ideals and each provider\'s real-world implementation quirks.',
      'The end result eliminated a major source of registration friction, enabling users to sign up with a single click while maintaining security best practices for token storage and session handling.',
    ],
    impact: 'Enabled frictionless authentication for thousands of users',
    technologies: ['OAuth2', 'PHP', 'React', 'TypeScript', 'PostgreSQL'],
  },
  {
    title: 'Aspera on Demand',
    company: 'IBM / Aspera',
    tags: ['Cloud Infrastructure', 'AWS', 'Automation'],
    summary: 'Built and optimized the AWS deployment infrastructure for Aspera on Demand, reducing provisioning time from 3 hours to 12 minutes through architectural improvements to the VM imaging pipeline.',
    description: [
      'For this project, I designed and implemented deployment automation for Aspera on Demand, enabling customers to provision virtual machines pre-configured with Aspera\'s high-speed transfer software. Aspera\'s FASP protocol delivers transfer speeds orders of magnitude faster than TCP, making it the standard for media companies, research institutions, and enterprises moving massive datasets.',
      'The provisioning pipeline was built from scratch: EC2 instance orchestration, EBS volume configuration tuned for I/O performance, S3 integration for transfer endpoints, and automated installation of the Aspera software stack.',
      'After diagnosing a critical bottleneck in the deployment workflow, I re-architected the approach entirely. By shifting software installation into the base AMI and applying only configuration deltas at runtime, deployment time dropped from 3 hours to just 12 minutes—a 15x improvement.',
      'This optimization transformed the customer experience: users could now spin up transfer capacity on-demand, quickly evaluate new Aspera releases, and scale their infrastructure without lengthy provisioning delays. The faster deployments also reduced AWS costs by minimizing billable instance time during setup.',
      'Working on this project gave me deep expertise in AWS infrastructure: EC2 for compute, EBS for persistent storage, S3 for object storage, IAM for fine-grained access control, and CloudFormation for repeatable infrastructure-as-code deployments.',
    ],
    impact: '15x faster deployment (3 hours → 12 minutes)',
    technologies: ['AWS EC2', 'AWS EBS', 'AWS S3', 'Shell Scripting', 'CloudFormation'],
  },
];

function ProjectCard({ project, index, isVisible }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Box
      sx={{
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
        '&:hover': {
          borderColor: 'var(--color-gold)',
          boxShadow: '0 20px 40px -20px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-cream)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
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
            <Typography
              component="h3"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 600,
                color: 'var(--color-ink)',
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {project.tags.map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '100px',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        {/* Summary */}
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--color-ink)',
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          {project.summary}
        </Typography>

        {/* Impact highlight */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1,
            mb: 3,
            backgroundColor: 'var(--color-gold-dim)',
            borderRadius: 2,
            border: '1px solid var(--color-gold)',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold)',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-gold)',
            }}
          >
            {project.impact}
          </Typography>
        </Box>

        {/* Expandable details */}
        <Box
          sx={{
            maxHeight: isExpanded ? '2000px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Box sx={{ pt: 2, borderTop: '1px solid var(--color-border)' }}>
            {project.description.map((paragraph, idx) => (
              <Typography
                key={idx}
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  mb: 2,
                  '&:last-child': { mb: 0 },
                }}
              >
                {paragraph}
              </Typography>
            ))}

            {/* Technologies */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid var(--color-border)' }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  mb: 1.5,
                }}
              >
                Technologies Used
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.technologies.map((tech) => (
                  <Box
                    key={tech}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-cream)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Expand/collapse button */}
        <Box
          component="button"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 3,
            px: 0,
            py: 0.5,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-gold)',
            transition: 'all 0.2s ease',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {isExpanded ? 'Show less' : 'Read more'}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            ↓
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function PortfolioPage(props) {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="noise-overlay">
        {/* Navigation bar */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            py: 2,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(var(--color-paper-rgb, 250, 248, 245), 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
            '[data-mui-color-scheme="dark"] &': {
              backgroundColor: 'rgba(10, 22, 40, 0.85)',
            },
          }}
        >
          <IconButton
            component={Link}
            to="/"
            sx={{
              color: 'var(--color-ink)',
              '&:hover': {
                backgroundColor: 'var(--color-gold-dim)',
                color: 'var(--color-gold)',
              },
            }}
            aria-label="Back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <ColorModeIconDropdown />
        </Box>

        {/* Main content */}
        <Box
          component="main"
          ref={sectionRef}
          sx={{
            pt: { xs: 12, md: 14 },
            pb: { xs: 8, md: 12 },
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="lg">
            {/* Page header */}
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
                Project Portfolio
              </Typography>
              <Typography
                component="h1"
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
                Featured Work
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                  color: 'var(--color-text-secondary)',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                A selection of projects where I've driven significant technical initiatives,
                from infrastructure optimization to developer experience improvements.
              </Typography>
            </Box>

            {/* Project cards */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                maxWidth: 900,
                mx: 'auto',
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

            {/* Footer note */}
            <Box
              sx={{
                mt: { xs: 6, md: 8 },
                textAlign: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 3,
                  py: 1.5,
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 2,
                  border: '1px solid var(--color-border)',
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
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  More projects available upon request
                </Typography>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-gold)',
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}
