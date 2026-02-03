import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppTheme from '../shared-theme/AppTheme';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import FunFacts from './components/FunFacts';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Blog(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box className="noise-overlay">
        <Header />
        <Box component="main">
          <Hero />
          <About />
          <Experience />
          <FunFacts />
          <Contact />
        </Box>
        <Footer />
      </Box>
    </AppTheme>
  );
}
