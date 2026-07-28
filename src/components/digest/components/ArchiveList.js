import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArchiveList({ entries, current }) {
  if (!entries || entries.length === 0) return null;

  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={{ mb: 0.5 }}>
        Archive
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Every edition, Monday through Friday.
      </Typography>
      <Divider />
      {entries.map((entry) => {
        const isCurrent = entry.date === current;
        return (
          <Box
            key={entry.date}
            sx={{
              py: 1.25,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              gap: 2,
              alignItems: 'baseline',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', minWidth: 150, flexShrink: 0 }}
            >
              {formatDate(entry.date)}
            </Typography>
            {isCurrent ? (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {entry.lead}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                to={`/digest/${entry.date}`}
                underline="hover"
                color="inherit"
                variant="body2"
              >
                {entry.lead}
              </Link>
            )}
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', ml: 'auto', flexShrink: 0 }}
            >
              {entry.curated}/{entry.total}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
