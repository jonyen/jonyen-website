import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function shortDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function Byline({ story }) {
  const date = shortDate(story.published);
  return (
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
    >
      {story.links.map((link, i) => (
        <React.Fragment key={link.url}>
          {i > 0 && ' · '}
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
          >
            {link.source}
          </Link>
        </React.Fragment>
      ))}
      {date && ` · ${date}`}
    </Typography>
  );
}

function Story({ story, dense }) {
  const href = story.links[0]?.url;
  return (
    <Box sx={{ py: dense ? 1.5 : 3 }}>
      <Typography
        variant={dense ? 'subtitle1' : 'h6'}
        component="h3"
        sx={{ lineHeight: 1.3 }}
      >
        {href ? (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
          >
            {story.title}
          </Link>
        ) : (
          story.title
        )}
      </Typography>
      <Byline story={story} />
      {story.summary && (
        <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
          {story.summary}
        </Typography>
      )}
      {story.why && (
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            pl: 1.5,
            borderLeft: '2px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          {story.why}
        </Typography>
      )}
    </Box>
  );
}

export default function CuratedStories({ top, sections }) {
  return (
    <Box component="section" sx={{ mb: 8 }}>
      {top.map((story, i) => (
        <React.Fragment key={`${story.title}-${i}`}>
          {i > 0 && <Divider />}
          <Story story={story} />
        </React.Fragment>
      ))}

      {sections.map((section) => (
        <Box key={section.name} sx={{ mt: 5 }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: '0.2em', color: 'text.secondary' }}
          >
            {section.name}
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {section.stories.map((story, i) => (
            <Story key={`${story.title}-${i}`} story={story} dense />
          ))}
        </Box>
      ))}
    </Box>
  );
}
