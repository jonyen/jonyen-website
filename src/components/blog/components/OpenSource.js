import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import zephyrShot from '../../../assets/repos/zephyr.jpg';
import watchCaptionsShot from '../../../assets/repos/apple-watch-captions.jpg';
import melonTapShot from '../../../assets/repos/melon-tap.jpg';
import audiobooksShot from '../../../assets/repos/audiobooks-appletv.jpg';

const showcased = [
  {
    repo: 'zephyr',
    title: 'Zephyr',
    summary:
      'Minimalist ESV Bible reader for macOS — scrubber navigation and Spotlight integration.',
    tags: ['Swift', 'SwiftUI', 'macOS'],
    screenshot: zephyrShot,
  },
  {
    repo: 'apple-watch-captions',
    title: 'Apple Watch Captions',
    summary:
      'Live captions of nearby speech on the Watch. Mic to a Fly.io relay to Deepgram, works on Watch cellular.',
    tags: ['Swift', 'watchOS', 'Deepgram', 'Fly.io'],
    screenshot: watchCaptionsShot,
  },
  {
    repo: 'melon-tap',
    title: 'Melon Tap',
    summary:
      'Rank watermelons by tapping them. Watch mic plus 800 Hz accelerometer, scored on-device and ranked within a bin.',
    tags: ['Swift', 'watchOS', 'Signal processing', 'Core ML'],
    screenshot: melonTapShot,
  },
  {
    repo: 'audiobooks-appletv',
    title: 'Audiobooks for Apple TV',
    summary:
      'Read-along audiobooks — LibriVox recordings synced to the matching Project Gutenberg text.',
    tags: ['Swift', 'SwiftUI', 'tvOS'],
    screenshot: audiobooksShot,
  },
];

const alsoBuilt = [
  {
    repo: 'dropnotch',
    summary:
      'Hover the MacBook notch to reveal and click menu bar icons hidden behind it.',
    tags: ['Swift', 'AppKit', 'ScreenCaptureKit'],
  },
  {
    repo: 'fh-community-bot',
    summary:
      'Slack bot for facilities maintenance — in-thread forms logged to Google Sheets, LLM-assisted duplicate detection, Lambda + SQS on SAM.',
    tags: ['JavaScript', 'AWS Lambda', 'SAM'],
  },
];

const repoUrl = (repo) => `https://github.com/jonyen/${repo}`;

function Tag({ label }) {
  return (
    <Box
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
      {label}
    </Box>
  );
}

function ShowcaseCard({ project, index, isVisible }) {
  return (
    <Box
      component="a"
      href={repoUrl(project.repo)}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        overflow: 'hidden',
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
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
      {/* Screenshots come from four different platforms, so their aspect ratios
          disagree wildly — a fixed-height box with contain keeps the grid even. */}
      <Box
        sx={{
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2.5,
          backgroundColor: 'var(--color-cream)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Box
          component="img"
          src={project.screenshot}
          alt={`${project.title} screenshot`}
          loading="lazy"
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '6px',
            boxShadow: '0 8px 20px -12px rgba(0, 0, 0, 0.45)',
          }}
        />
      </Box>

      <Box sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'var(--color-gold)',
          }}
        >
          <GitHubIcon sx={{ fontSize: 15, opacity: 0.75 }} />
          jonyen/{project.repo}
        </Box>

        <Typography
          component="h3"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '1.25rem', md: '1.375rem' },
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
          }}
        >
          {project.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
          }}
        >
          {project.summary}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', pt: 0.75 }}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function CompactRow({ project, index, isVisible }) {
  return (
    <Box
      component="a"
      href={repoUrl(project.repo)}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 2,
        px: 3,
        py: 2.25,
        textDecoration: 'none',
        backgroundColor: 'var(--color-paper)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.08}s`,
        '&:hover': {
          borderColor: 'var(--color-gold)',
        },
      }}
    >
      <Box
        sx={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
          color: 'var(--color-ink)',
          flexShrink: 0,
        }}
      >
        {project.repo}
      </Box>
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          flex: 1,
          minWidth: 220,
        }}
      >
        {project.summary}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {project.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </Box>
    </Box>
  );
}

export default function OpenSource() {
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
      id="open-source"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: 'var(--color-paper)',
      }}
    >
      <Container maxWidth="lg">
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
            04 / Open Source
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
            Things I&apos;ve built
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 520,
              mx: 'auto',
            }}
          >
            Side projects, mostly Swift and mostly scratching my own itch.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {showcased.map((project, index) => (
            <ShowcaseCard
              key={project.repo}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </Box>

        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              mb: 2,
            }}
          >
            Also built
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {alsoBuilt.map((project, index) => (
              <CompactRow
                key={project.repo}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
