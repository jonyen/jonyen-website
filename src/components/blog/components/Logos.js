import * as React from 'react';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';

import asperaLogo from '../../../assets/aspera-seeklogo.png';
import cventLogo from '../../../assets/cvent-logo.png';
import medalliaLogo from '../../../assets/medallia-logo.png';
import ibmLogo from '../../../assets/IBM-8-bar-logo.svg';
import atlassianLogo from '../../../assets/atlassian-logo.svg';

export default function Logos() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Item>
        <a href="https://atlassian.com">
          <img 
            src={atlassianLogo} 
            alt="Atlassian logo" 
            style={{ 
              width: 'auto', 
              height: '20px', 
              filter: 'grayscale(100%)',
              objectFit: 'contain'
            }} 
          />
        </a>
      </Item>
      <Item>
        <a href="https://medallia.com">
          <img 
            src={medalliaLogo} 
            alt="Medallia logo" 
            style={{ 
              width: 'auto', 
              height: '20px', 
              filter: 'grayscale(100%)',
              objectFit: 'contain'
            }} 
          />
        </a>
      </Item>
      <Item>
        <a href="https://cvent.com">
          <img 
            src={cventLogo} 
            alt="Cvent logo" 
            style={{ 
              width: 'auto', 
              height: '20px', 
              filter: 'grayscale(100%)',
              objectFit: 'contain'
            }} 
          />
        </a>
      </Item>
      <Item>
        <a href="https://ibm.com">
          <img 
            src={ibmLogo} 
            alt="IBM logo" 
            style={{ 
              width: 'auto', 
              height: '20px', 
              filter: 'grayscale(100%)',
              objectFit: 'contain'
            }} 
          />
        </a>
      </Item>
      <Item>
        <a href="https://asperasoft.com">
          <img 
            src={asperaLogo} 
            alt="Aspera logo" 
            style={{ 
              width: 'auto', 
              height: '20px', 
              filter: 'grayscale(100%)',
              objectFit: 'contain'
            }} 
          />
        </a>
      </Item>
    </Grid>
  );
}