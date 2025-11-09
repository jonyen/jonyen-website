import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import { trackCardInteraction } from '../../../utils/analytics';

import programmingImage from '../../../assets/programming.jpg';
import Logos from './Logos';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  // WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'pre-line',
});



function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};


const cardData = [
  {
    img: programmingImage,
    tag: 'Engineering',
    title: 'About Me',
    description:
      `A software engineer by trade, I've worked at industry-leading companies over the past 15 years and have collaborated with some of the brightest minds in the industry. I've worked across a wide range of tech stacks including React, Node.js, Ruby on Rails, PHP, Postgres, MySQL, Redis, iOS, Android, Java/Kotlin, AWS, and many others. Educated at UC Berkeley, I spent over 10 years in the Bay Area before moving to Northern Virginia where I currently reside. Outside of work, I'm a Sunday school teacher and I lead my church's children's ministry of over 40 kids along with my wife.`,
    authors: [
      { name: 'Jonathan Yen', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    img: programmingImage,
    tag: 'Product',
    title: 'Software Engineering ',
    description:
      'Computers - the most complex machine ever created by mankind. They are capable of doing incredible things, but they are also capable of doing incredibly stupid things. I am a software engineer, and I am here to help you understand how computers work.',
    authors: [{ name: 'Jonathan Yen', avatar: '/static/images/avatar/6.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=6',
    tag: 'Product',
    title: 'Fun Facts',
    description:
      `* I have run 4 marathons and countless half-marathons
      * I have visited over 20 countries across 4 continents
      * Never had a cup of coffee in my life`,
    authors: [{ name: 'Jonathan Yen', avatar: '/static/images/avatar/2.jpg' }],
  },
];

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
    // Track engagement with different sections of portfolio
    const cardTitles = ['About Me', 'Programming Image', 'Fun Facts'];
    if (cardTitles[index]) {
      trackCardInteraction(cardTitles[index], 'focus');
    }
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography variant="h1">
            Jonathan Yen
          </Typography>
          <Typography>Experienced Full Stack Software Engineer based in Washington DC Metro region</Typography>
        </div>
        <ColorModeIconDropdown />
      </Box>
      <Logos />
     <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
      </Box>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard
            variant="outlined"
            onFocus={() => handleFocus(0)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
          >
            <StyledCardContent>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[0].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[0].description}
              </StyledTypography>
            </StyledCardContent>
            <StyledCardContent>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[2].title}
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {cardData[2].description.split('\n').filter(line => line.trim().startsWith('*')).map((line, index) => (
                  <Typography component="li" variant="body2" color="text.secondary" key={index} sx={{ mb: 0.5 }}>
                    {line.trim().substring(1).trim()}
                  </Typography>
                ))}
              </Box>
            </StyledCardContent>
        </StyledCard>
        </Grid>
        {!isMobile && (
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledCard
              variant="outlined"
              onFocus={() => handleFocus(1)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
            >
              {/* Image attribution: https://unsplash.com/photos/black-flat-screen-computer-monitor-mZnx9429i94 */}
              <CardMedia
                component="img"
                alt="Black computer monitor displaying code on screen in a dark workspace"
                image={cardData[1].img}
                sx={{
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </StyledCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
