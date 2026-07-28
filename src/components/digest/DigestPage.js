import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import CuratedStories from './components/CuratedStories';
import FullFeed from './components/FullFeed';
import ArchiveList from './components/ArchiveList';

// Deliberately not /digest — that is the route. A data directory of the same
// name shadows the SPA path on any static host that serves directories.
const DIGEST_ROOT = `${process.env.PUBLIC_URL || ''}/digest-data`;

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DigestPage(props) {
  const { date } = useParams();
  const [edition, setEdition] = React.useState(null);
  const [archive, setArchive] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [date]);

  React.useEffect(() => {
    let cancelled = false;
    setEdition(null);
    setError(null);

    const file = date ? `${date}.json` : 'latest.json';
    fetch(`${DIGEST_ROOT}/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`No digest for ${date || 'today'}`);
        return r.json();
      })
      .then((data) => !cancelled && setEdition(data))
      .catch((e) => !cancelled && setError(e.message));

    fetch(`${DIGEST_ROOT}/index.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => !cancelled && setArchive(data))
      .catch(() => !cancelled && setArchive([]));

    return () => {
      cancelled = true;
    };
  }, [date]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="noise-overlay">
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
          <IconButton component={Link} to="/" aria-label="Back to home">
            <ArrowBackIcon />
          </IconButton>
          <ColorModeIconDropdown />
        </Box>

        <Container maxWidth="md" sx={{ pt: 12, pb: 10 }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: '0.22em', color: 'text.secondary' }}
          >
            Automata
          </Typography>
          <Typography variant="h3" component="h1" sx={{ mt: 1, mb: 0.5 }}>
            Tech Digest
          </Typography>

          {error && (
            <Alert severity="info" sx={{ mt: 4 }}>
              {error}. <Link to="/digest">See the latest edition.</Link>
            </Alert>
          )}

          {!edition && !error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {edition && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 1 }}
              >
                {formatDate(edition.date)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
                {edition.items.length} items published across{' '}
                {edition.sources.length} sources in the last seven days.{' '}
                The email carries the{' '}
                {edition.top.length +
                  edition.sections.reduce((n, s) => n + s.stories.length, 0)}{' '}
                that mattered most; everything else is below.
              </Typography>

              {edition.degraded && (
                <Alert severity="warning" sx={{ mb: 4 }}>
                  Automatic curation was unavailable for this edition; items are
                  ranked by source and engagement.
                </Alert>
              )}

              <CuratedStories top={edition.top} sections={edition.sections} />
              <FullFeed items={edition.items} sources={edition.sources} />
              <ArchiveList entries={archive} current={edition.date} />
            </>
          )}
        </Container>
      </Box>
    </AppTheme>
  );
}
