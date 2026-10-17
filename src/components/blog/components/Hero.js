import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import profileNoIris from '../../../assets/profile-noiris.jpg';
import irisLeft from '../../../assets/memoji-iris-left.png';
import irisRight from '../../../assets/memoji-iris-right.png';
import eyesMask from '../../../assets/memoji-eyes-mask.png';

// Said by the memoji when it's clicked. Edit freely.
const SAYINGS = [
  'Jesus is my single source of truth.',
  'Jesus saves. I should press Ctrl+S more often.',
  "I'd tell you a UDP joke, but you might not get it.",
  "My code works and I don't know why. Please don't touch it.",
  'Noah shipped on time: fixed scope, two of everything.',
  'The Tower of Babel: the first project sunk by a communication breakdown.',
  'Moses dropped v1 of the tablets. Even the Ten Commandments needed a re-release.',
  'Faith is trusting the build will pass. Wisdom is running the tests anyway.',
  "It's not a bug, it's an undocumented feature.",
  'Why do developers like dark mode? Light attracts bugs.',
  'Rubber-duck debugging works. The duck never interrupts.',
  'Teaching Sunday school: the only crowd tougher than code review.',
  'Married life: we merge without conflicts. Mostly.',
  "There are 10 kinds of people: those who read binary and those who don't.",
];

// Where the eyes sit in the 1000x1000 memoji, from scripts that cut the irises
// out of src/assets/profile.png. EYES_BOX is the region the eye mask covers;
// each iris is placed in % of that box.
const EYES_BOX = { left: '30.7%', top: '49.7%', width: '33.6%', height: '5.9%' };
const IRISES = [
  { src: irisLeft, left: '7.44%', top: '-16.949%', width: '23.512%', height: '133.898%' },
  { src: irisRight, left: '69.345%', top: '-8.475%', width: '24.107%', height: '137.288%' },
];
// Iris travel at full gaze, as % of the iris's own size (about 14px and 5px
// of the 1000px source), so it stays mostly inside the eye.
const MAX_LOOK_X = 17;
const MAX_LOOK_Y = 6;
// Easing time constant: the eyes cover ~63% of the way to the target in this time.
const EASE_MS = 150;
// Pointer distance (px) at which the gaze is ~76% of the way to full.
const GAZE_REACH_PX = 320;
const IDLE_MS = 2000;
const BUBBLE_MS = 4000;

export default function Hero() {
  const avatarRef = React.useRef(null);
  const [saying, setSaying] = React.useState(null);
  const lastSaying = React.useRef(-1);
  const bubbleTimer = React.useRef(0);

  const speak = () => {
    let i = Math.floor(Math.random() * (SAYINGS.length - 1));
    if (i >= lastSaying.current && lastSaying.current >= 0) i += 1;
    lastSaying.current = i;
    // A fresh key restarts the pop-in animation when one saying replaces another.
    setSaying({ text: SAYINGS[i], key: Date.now() });
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setSaying(null), BUBBLE_MS);
  };
  React.useEffect(() => () => clearTimeout(bubbleTimer.current), []);

  // Let the eyes follow the pointer. A requestAnimationFrame loop eases them
  // toward the target and writes CSS variables, so React never re-renders per
  // frame; the loop stops once they settle or the hero is off screen. Touch
  // screens and reduced-motion users keep the eyes centred.
  React.useEffect(() => {
    const el = avatarRef.current;
    if (!el) return undefined;
    // matchMedia is missing in jsdom (tests); treat that as "no fine pointer".
    const matches = (query) => window.matchMedia?.(query).matches ?? false;
    if (!matches('(pointer: fine)') || matches('(prefers-reduced-motion: reduce)')) return undefined;

    let frame = 0;
    let last = 0;
    let visible = true;
    let idleTimer = 0;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const step = (now) => {
      const dt = last ? Math.min(now - last, 100) : 16;
      last = now;
      const k = 1 - Math.exp(-dt / EASE_MS);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      el.style.setProperty('--look-x', cur.x.toFixed(4));
      el.style.setProperty('--look-y', cur.y.toFixed(4));
      if (Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.002) {
        frame = requestAnimationFrame(step);
      } else {
        frame = 0;
      }
    };
    const run = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    };
    const lookAt = (x, y) => {
      target.x = x;
      target.y = y;
      run();
    };
    const onMove = (e) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      // tanh eases the response off with distance, so far-away movement barely registers.
      const scale = Math.tanh(dist / GAZE_REACH_PX) / dist;
      lookAt(dx * scale, dy * scale);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => lookAt(0, 0), IDLE_MS);
    };
    const onLeave = () => lookAt(0, 0);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) lookAt(0, 0);
    });
    io.observe(el);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 'var(--header-height, 80px)', md: 0 },
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: { xs: '300px', md: '500px' },
          height: { xs: '300px', md: '500px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-gold-dim) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: { xs: '200px', md: '400px' },
          height: { xs: '200px', md: '400px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-gold-dim) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: '900px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <Box
            className="animate-in"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              px: 2,
              py: 1,
              borderRadius: '100px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-cream)',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <AccountBalanceIcon
              sx={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Washington DC Metro
            </Typography>
          </Box>

          {/* Profile image and heading row */}
          <Box
            className="animate-in animate-delay-1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 3, md: 4 },
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ position: 'relative', flex: 'none' }}>
              <Box
                component="button"
                type="button"
                ref={avatarRef}
                onClick={speak}
                aria-label="Say something"
                sx={{
                  display: 'block',
                  position: 'relative',
                  p: 0,
                  width: { xs: 100, sm: 120, md: 150 },
                  height: { xs: 100, sm: 120, md: 150 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--color-ink)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  background: 'none',
                  cursor: 'pointer',
                  '&:focus-visible': { outline: '3px solid var(--color-gold)', outlineOffset: '3px' },
                }}
              >
                {/* The memoji with its irises painted out; the irises sit on top. */}
                <Box
                  component="img"
                  src={profileNoIris}
                  alt="Jonathan Yen"
                  sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    ...EYES_BOX,
                    maskImage: `url(${eyesMask})`,
                    WebkitMaskImage: `url(${eyesMask})`,
                    maskSize: '100% 100%',
                    WebkitMaskSize: '100% 100%',
                  }}
                >
                  {IRISES.map(({ src, ...pos }) => (
                    <Box
                      key={src}
                      component="img"
                      src={src}
                      alt=""
                      sx={{
                        position: 'absolute',
                        ...pos,
                        maxWidth: 'none',
                        transform: `translate(calc(var(--look-x, 0) * ${MAX_LOOK_X}%), calc(var(--look-y, 0) * ${MAX_LOOK_Y}%))`,
                        willChange: 'transform',
                      }}
                    />
                  ))}
                </Box>
              </Box>
              {/* Speech bubble to the right of the memoji, over the start of the name;
                  absolutely placed so it never moves the layout. The phone widths
                  leave the 16px/24px page gutter clear. */}
              <Box
                role="status"
                aria-live="polite"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 'calc(100% + 14px)',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  width: 'max-content',
                  maxWidth: {
                    xs: 'min(240px, calc(100vw - 146px))',
                    sm: 'min(280px, calc(100vw - 182px))',
                    md: 320,
                  },
                  pointerEvents: 'none',
                }}
              >
                {saying && (
                  <Box
                    key={saying.key}
                    sx={{
                      position: 'relative',
                      px: 2,
                      py: 1.25,
                      borderRadius: '16px',
                      border: '1.5px solid var(--color-ink)',
                      backgroundColor: 'var(--color-paper)',
                      color: 'var(--color-ink)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      lineHeight: 1.4,
                      boxShadow: '0 8px 24px rgba(10, 22, 40, 0.12)',
                      transformOrigin: 'left center',
                      animation: 'bubbleIn 0.22s var(--ease-out-quart) both',
                      '@keyframes bubbleIn': {
                        from: { opacity: 0, transform: 'scale(0.85) translateX(-6px)' },
                        to: { opacity: 1, transform: 'none' },
                      },
                      // Tail on the left, pointing at the memoji.
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: -8,
                        top: '50%',
                        width: 14,
                        height: 14,
                        backgroundColor: 'var(--color-paper)',
                        borderLeft: '1.5px solid var(--color-ink)',
                        borderBottom: '1.5px solid var(--color-ink)',
                        transform: 'translateY(-50%) rotate(45deg)',
                      },
                    }}
                  >
                    {saying.text}
                  </Box>
                )}
              </Box>
            </Box>
            {/* Main heading */}
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' },
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: 'var(--color-ink)',
              }}
            >
              Jonathan Yen
            </Typography>
          </Box>

          {/* Subtitle with animated line */}
          <Box className="animate-in animate-delay-2" sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              {/* Grows with scaleX rather than width so the title beside it never moves. */}
              <Box
                sx={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: 'var(--color-gold)',
                  animation: 'drawLine 0.8s ease-out 0.6s both',
                  transformOrigin: 'left',
                }}
              />
              <Typography
                sx={{
                  flex: 'none',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-display)',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 500,
                  color: 'var(--color-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                Full Stack Engineer
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: { xs: '1.125rem', md: '1.375rem' },
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '600px',
              }}
            >
              15+ years writing software for industry-leading companies.
              UC Berkeley alumnus with a passion for building elegant solutions to complex problems.
            </Typography>
          </Box>

          {/* Stats row */}
          <Box
            className="animate-in animate-delay-3"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 3, md: 5 },
              mb: 5,
            }}
          >
          </Box>

          {/* CTA Button */}
          <Box className="animate-in animate-delay-4">
            <Button
              onClick={scrollToAbout}
              endIcon={<ArrowDownwardIcon />}
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'var(--color-ink)',
                backgroundColor: 'transparent',
                border: '2px solid var(--color-ink)',
                borderRadius: '100px',
                px: 4,
                py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                  transform: 'translateY(-2px)',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateY(3px)',
                  },
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              Explore My Journey
            </Button>
          </Box>
        </Box>
      </Container>

    </Box>
  );
}
