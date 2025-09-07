import * as React from 'react';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import { useColorScheme } from '@mui/material/styles';
import { useMediaQuery, useTheme } from '@mui/material';

import asperaLogo from '../../../assets/aspera-seeklogo.png';
import cventLogo from '../../../assets/cvent-logo.png';
import medalliaLogo from '../../../assets/medallia-logo.png';
import ibmLogo from '../../../assets/IBM-8-bar-logo.svg';
import atlassianLogo from '../../../assets/atlassian-logo.svg';

function LogoImage({ src, alt, href }) {
  const { mode } = useColorScheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const canvasRef = React.useRef(null);

  
  const getImageStyle = () => {
    if (isMobile) {
      return {
        width: 'auto', 
        height: '20px', 
        objectFit: 'contain',
        filter: mode === 'dark' ? 'grayscale(100%) invert(1)' : 'grayscale(100%)'
      };
    }
    
    return {
      width: 'auto', 
      height: '20px', 
      objectFit: 'contain',
      filter: mode === 'dark' 
        ? 'grayscale(100%) invert(1) brightness(1)'
        : 'grayscale(100%)',
      WebkitFilter: mode === 'dark' 
        ? 'grayscale(100%) invert(1) brightness(1)'
        : 'grayscale(100%)'
    };
  };
  
  return (
    <a href={href}>
      <img 
        ref={canvasRef}
        src={src}
        alt={alt} 
        style={getImageStyle()}
      />
    </a>
  );
}

export default function Logos() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Item>
        <LogoImage 
          src={atlassianLogo} 
          alt="Atlassian logo"
          href="https://atlassian.com"
        />
      </Item>
      <Item>
        <LogoImage 
          src={medalliaLogo} 
          alt="Medallia logo"
          href="https://medallia.com"
        />
      </Item>
      <Item>
        <LogoImage 
          src={cventLogo} 
          alt="Cvent logo"
          href="https://cvent.com"
        />
      </Item>
      <Item>
        <LogoImage 
          src={ibmLogo} 
          alt="IBM logo"
          href="https://ibm.com"
        />
      </Item>
      <Item>
        <LogoImage 
          src={asperaLogo} 
          alt="Aspera logo"
          href="https://asperasoft.com"
        />
      </Item>
    </Grid>
  );
}