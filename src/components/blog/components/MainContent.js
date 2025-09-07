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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled, useColorScheme, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { InlineWidget } from 'react-calendly';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import programmingImage from '../../../assets/programming.jpg';
import atlassianFavicon from '../../../assets/atlassian-favicon.png';
import medalliaFavicon from '../../../assets/medallia-favicon.png';
import cventFavicon from '../../../assets/cvent-favicon.png';
import ibmLogo from '../../../assets/IBM-8-bar-logo.svg';
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
      `I’m a software engineer with 15+ years of experience building full-stack web applications, leading frontend teams, and scaling infrastructure. I’ve worked at industry-leading companies including Atlassian, Medallia, and IBM.

My expertise lies in JavaScript/TypeScript, React, GraphQL, Node.js, and DevOps tooling in Docker and Kubernetes. Whether it’s building internal tools or customer-facing apps, I focus on elegant solutions that balance performance and maintainability.

I completed both my master’s in Information Management & Systems and my undergraduate degree in Computer Science and Cognitive Science at the University of California, Berkeley.`,
    authors: [
      { name: 'Jonathan Yen', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    img: programmingImage,
    tag: 'Product',
    title: 'Innovative product features that drive success',
    description:
      'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
    authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=6',
    tag: 'Product',
    title: 'Fun Facts',
    description:
      `* I have run 4 marathons and countless half-marathons
      * I have visited over 20 countries across 4 continents
      * Never had a cup of coffee in my life`,
    authors: [{ name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' }],
  },
];

const technologiesData = [
  {
    technology: 'JavaScript',
    proficiency: 90,
    level: 'Expert',
    experience: '10+ years',
    companies: ['Atlassian', 'Medallia', 'Cvent', 'IBM / Aspera']
  },
  {
    technology: 'TypeScript',
    proficiency: 80,
    level: 'Advanced',
    experience: '5+ years',
    companies: ['Atlassian', 'Medallia']
  },
  {
    technology: 'React',
    proficiency: 90,
    level: 'Advanced',
    experience: '7+ years',
    companies: ['Atlassian', 'Medallia', 'Cvent']
  },
  {
    technology: 'Node.js',
    proficiency: 85,
    level: 'Advanced',
    experience: '7+ years',
    companies: ['Atlassian', 'Medallia']
  },
  {
    technology: 'GraphQL',
    proficiency: 80,
    level: 'Advanced',
    experience: '6+ years',
    companies: ['Atlassian', 'Medallia']
  },
  {
    technology: 'Docker/Kubernetes',
    proficiency: 75,
    level: 'Advanced',
    experience: '6+ years',
    companies: ['Medallia']
  },
  {
    technology: 'Python',
    proficiency: 70,
    level: 'Intermediate',
    experience: '2+ years',
    companies: ['Early Career']
  },
  {
    technology: 'Amazon Web Services',
    proficiency: 75,
    level: 'Advanced',
    experience: '4 years',
    companies: ['IBM / Aspera']
  },
  {
    technology: 'Java/Kotlin',
    proficiency: 60,
    level: 'Intermediate',
    experience: '3 years',
    companies: ['Atlassian', 'Early Career']
  },
  {
    technology: 'Ruby on Rails',
    proficiency: 70,
    level: 'Intermediate',
    experience: '4 years',
    companies: ['Cvent', 'IBM / Aspera', 'Medallia']
  },
  {
    technology: 'Jest',
    proficiency: 85,
    level: 'Advanced',
    experience: '5 years',
    companies: ['Atlassian', 'Medallia', 'Cvent']
  },
  {
    technology: 'Playwright',
    proficiency: 60,
    level: 'Intermediate',
    experience: '2 years',
    companies: ['Atlassian']
  },

  {
    technology: 'Shell Scripting',
    proficiency: 75,
    level: 'Advanced',
    experience: '10+ years',
    companies: ['Atlassian', 'Medallia', 'Cvent', 'IBM / Aspera', 'Early Career']
  },
  {
    technology: 'Angular',
    proficiency: 50,
    level: 'Beginner',
    experience: '2 years',
    companies: ['Medallia']
  },
  {
    technology: 'Vue.js',
    proficiency: 50,
    level: 'Beginner',
    experience: '2 years',
    companies: ['Medallia']
  },
  {
    technology: 'Swift/Objective-C',
    proficiency: 50,
    level: 'Beginner',
    experience: '2+ years',
    companies: ['Medallia', 'Early Career']
  },
  {
    technology: 'Android Development',
    proficiency: 30,
    level: 'Beginner',
    experience: '1 years',
    companies: ['Medallia']
  },
  {
    technology: 'PHP',
    proficiency: 75,
    level: 'Advanced',
    experience: '6+ years',
    companies: ['Medallia', 'Early Career']
  },
  {
    technology: 'ActionScript',
    proficiency: 60,
    level: 'Intermediate',
    experience: '3 years',
    companies: ['Early Career']
  }
];

const companyFavicons = {
  'Atlassian': atlassianFavicon,
  'Medallia': medalliaFavicon,
  'Cvent': cventFavicon,
  'IBM / Aspera': ibmLogo,
  'Early Career': null // No favicon for this
};

function CompanyIcon({ company }) {
  const { mode } = useColorScheme();
  const faviconUrl = companyFavicons[company];
  
  if (!faviconUrl) {
    return (
      <Chip 
        label={company} 
        size="small" 
        sx={{ fontSize: '0.6rem', height: '18px' }}
      />
    );
  }
  
  return (
    <img 
      src={faviconUrl} 
      alt={company}
      title={company}
      style={{ 
        width: '20px', 
        height: '20px',
        objectFit: 'contain',
        filter: mode === 'dark' 
          ? 'grayscale(100%) invert(1)' 
          : 'grayscale(100%)'
      }}
    />
  );
}

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
  const [selectedCompany, setSelectedCompany] = React.useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
  };

  const allCompanies = [...new Set(technologiesData.flatMap(tech => tech.companies))].sort();

  const filteredTechnologies = technologiesData.filter(tech => {
    const matchesCompany = !selectedCompany || 
      tech.companies.includes(selectedCompany);
    
    return matchesCompany;
  });


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

      <StyledCard variant="outlined" sx={{ mt: 2 }}>
        <StyledCardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Skills & Technologies</Typography>
          <StyledTypography variant="body2" color="text.secondary" gutterBottom>
            Throughout my 15+ year career, I've collaborated with exceptional engineers at industry-leading companies, each experience shaping my technical expertise and professional growth. From building scalable web applications to leading frontend initiatives, I've worked with diverse programming languages and frameworks across different domains.
            
            The table below showcases the technologies I've mastered throughout my journey, with self-assessed proficiency levels based on hands-on experience and real-world application at each company.
          </StyledTypography>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Filter by Company:</Typography>
            <ToggleButtonGroup
              value={selectedCompany}
              exclusive
              onChange={handleCompanyChange}
              aria-label="company filter"
              size="small"
              sx={{ flexWrap: 'wrap' }}
            >
              <ToggleButton value="" aria-label="all companies">
                All
              </ToggleButton>
              {allCompanies.map((company) => (
                <ToggleButton key={company} value={company} aria-label={company}>
                  {company}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <TableContainer 
            component={Paper} 
            sx={{ 
              mt: 1, 
              border: 1, 
              borderColor: 'divider',
              height: 600,
              overflow: 'auto'
            }}
          >
        <Table sx={{ minWidth: 650 }} aria-label="skills table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Technology</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Proficiency</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Experience</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Companies Used At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTechnologies.map((tech) => (
              <TableRow key={tech.technology} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{tech.technology}</Typography>
                </TableCell>
                <TableCell align="center">{tech.experience}</TableCell>
                <TableCell align="center">
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={tech.proficiency} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>{tech.level}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {tech.companies.map((company, companyIndex) => (
                      <CompanyIcon key={companyIndex} company={company} />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </StyledCardContent>
      </StyledCard>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard
                variant="outlined"
                onFocus={() => handleFocus(0)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
                sx={{ height: '100%' }}
              >
                <StyledCardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {cardData[2].title}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      I have run 4 marathons and countless half-marathons
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      I have visited over 20 countries across 4 continents
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Never had a cup of coffee in my life
                    </Typography>
                  </Box>
                </StyledCardContent>
              </StyledCard>
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard
            variant="outlined"
            sx={{ height: '100%' }}
          >
            <StyledCardContent>
              <Typography gutterBottom variant="h6" component="div">
                Schedule a Meeting with Me
              </Typography>
              <Box sx={{ height: 300 }}>
                <InlineWidget 
                  url="https://calendly.com/jonyen" 
                  styles={{
                    height: '100%',
                    width: '100%'
                  }}
                />
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid> */}
      </Grid>

    </Box>
  );
}
