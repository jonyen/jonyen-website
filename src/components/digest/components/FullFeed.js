import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const CATEGORY_LABELS = {
  ai: 'AI & LLMs',
  web: 'Web & Frontend',
  devtools: 'Devtools & Platform',
  engineering: 'Engineering',
  aggregator: 'Aggregators',
};

function shortDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function FullFeed({ items, sources }) {
  const [category, setCategory] = React.useState(null);
  const [source, setSource] = React.useState(null);
  const [hideCurated, setHideCurated] = React.useState(false);

  const categories = React.useMemo(() => {
    const counts = new Map();
    items.forEach((i) => counts.set(i.category, (counts.get(i.category) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const visible = React.useMemo(() => {
    return items
      .filter((i) => !category || i.category === category)
      .filter((i) => !source || i.source === source)
      .filter((i) => !hideCurated || !i.curated)
      .sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  }, [items, category, source, hideCurated]);

  return (
    <Box component="section" sx={{ mb: 8 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 0.5 }}>
        Everything else
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        The full seven-day window, including what did not make the email.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {categories.map(([key, count]) => (
          <Chip
            key={key}
            size="small"
            label={`${CATEGORY_LABELS[key] || key} (${count})`}
            variant={category === key ? 'filled' : 'outlined'}
            onClick={() => setCategory(category === key ? null : key)}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {sources.map((s) => (
          <Chip
            key={s.name}
            size="small"
            label={`${s.name} (${s.count})`}
            variant={source === s.name ? 'filled' : 'outlined'}
            onClick={() => setSource(source === s.name ? null : s.name)}
            sx={{ opacity: source && source !== s.name ? 0.5 : 1 }}
          />
        ))}
      </Stack>

      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={hideCurated}
            onChange={(e) => setHideCurated(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hide what was already in the email
          </Typography>
        }
        sx={{ mb: 1 }}
      />

      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
        Showing {visible.length} of {items.length}
      </Typography>

      <Divider />
      {visible.map((item) => (
        <Box
          key={item.url}
          sx={{
            py: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
            opacity: item.curated ? 0.65 : 1,
          }}
        >
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
            variant="body2"
          >
            {item.title}
          </Link>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {item.source}
            {item.published && ` · ${shortDate(item.published)}`}
            {typeof item.score === 'number' && ` · ${item.score} points`}
            {item.curated && ' · in the email'}
          </Typography>
        </Box>
      ))}

      {visible.length === 0 && (
        <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
          Nothing matches those filters.
        </Typography>
      )}
    </Box>
  );
}
