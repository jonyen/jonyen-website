import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Fun Facts', href: '#fun-facts' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: GitHubIcon, href: 'https://github.com/jonyen', label: 'GitHub' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/jonyen/', label: 'LinkedIn' },
  { icon: DescriptionIcon, href: '/resume', label: 'Resume' },
  { icon: CalendarMonthIcon, href: '/schedule', label: 'Schedule' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
    setMobileOpen(false);
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          py: scrolled ? 1.5 : 2.5,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: scrolled
            ? 'rgba(var(--color-paper-rgb, 250, 248, 245), 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
          '[data-mui-color-scheme="dark"] &': {
            backgroundColor: scrolled
              ? 'rgba(10, 22, 40, 0.85)'
              : 'transparent',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo / Name */}
            <Box
              component="a"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: 'var(--color-ink)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            >
              JY
            </Box>

            {/* Desktop Navigation */}
            <Box
              component="nav"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'var(--color-ink)',
                      backgroundColor: 'var(--color-gold-dim)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Social icons - desktop only */}
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5 }}>
                {socialLinks.map((link) => (
                  <IconButton
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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

              <ColorModeIconDropdown />

              {/* Mobile menu button */}
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
                  color: 'var(--color-ink)',
                }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'var(--color-paper)',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              Menu
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'var(--color-ink)' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ mb: 4 }}>
            {navItems.map((item, index) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    py: 2,
                    borderBottom: '1px solid var(--color-border)',
                    animation: `slideInFromLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                    '&:hover': {
                      backgroundColor: 'var(--color-gold-dim)',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color: 'var(--color-ink)',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {socialLinks.map((link) => (
              <IconButton
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : '_self'}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
                sx={{
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  p: 1.5,
                  '&:hover': {
                    color: 'var(--color-gold)',
                    borderColor: 'var(--color-gold)',
                    backgroundColor: 'var(--color-gold-dim)',
                  },
                }}
              >
                <link.icon />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
