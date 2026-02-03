import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const socialLinks = [
  { icon: GitHubIcon, href: 'https://github.com/jonyen', label: 'GitHub' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/jonyen/', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, md: 5 },
        backgroundColor: 'var(--color-cream)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          {/* Logo and copyright */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 1, sm: 3 },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-ink)',
                letterSpacing: '-0.02em',
              }}
            >
              Jonathan Yen
            </Typography>
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                width: 4,
                height: 4,
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
              {new Date().getFullYear()} All rights reserved
            </Typography>
          </Box>

          {/* Social links */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((link) => (
              <IconButton
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                sx={{
                  color: 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'var(--color-gold)',
                    backgroundColor: 'var(--color-gold-dim)',
                  },
                }}
              >
                <link.icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Decorative line */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              opacity: 0.6,
              letterSpacing: '0.05em',
            }}
          >
            Built with React & Material-UI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
