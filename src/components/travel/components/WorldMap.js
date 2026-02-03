import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Country data with coordinates for markers
const visitedCountries = [
  { name: 'Thailand', coordinates: [100.5018, 13.7563], code: 'THA' },
  { name: 'Cambodia', coordinates: [104.9282, 11.5564], code: 'KHM' },
  { name: 'Vietnam', coordinates: [105.8342, 21.0285], code: 'VNM' },
  { name: 'Malaysia', coordinates: [101.6869, 3.1390], code: 'MYS' },
  { name: 'Taiwan', coordinates: [121.5654, 25.0330], code: 'TWN' },
  { name: 'China', coordinates: [116.4074, 39.9042], code: 'CHN' },
  { name: 'South Korea', coordinates: [126.9780, 37.5665], code: 'KOR' },
  { name: 'Singapore', coordinates: [103.8198, 1.3521], code: 'SGP' },
  { name: 'Japan', coordinates: [139.6917, 35.6895], code: 'JPN' },
  { name: 'Canada', coordinates: [-106.3468, 56.1304], code: 'CAN' },
  { name: 'Mexico', coordinates: [-99.1332, 19.4326], code: 'MEX' },
  { name: 'Australia', coordinates: [151.2093, -33.8688], code: 'AUS' },
  { name: 'Germany', coordinates: [13.4050, 52.5200], code: 'DEU' },
  { name: 'France', coordinates: [2.3522, 48.8566], code: 'FRA' },
  { name: 'Switzerland', coordinates: [8.5417, 47.3769], code: 'CHE' },
  { name: 'United Kingdom', coordinates: [-0.1276, 51.5074], code: 'GBR' },
  { name: 'Belgium', coordinates: [4.3517, 50.8503], code: 'BEL' },
  { name: 'Denmark', coordinates: [12.5683, 55.6761], code: 'DNK' },
  { name: 'Italy', coordinates: [12.4964, 41.9028], code: 'ITA' },
  { name: 'Greece', coordinates: [23.7275, 37.9838], code: 'GRC' },
  { name: 'Austria', coordinates: [16.3738, 48.2082], code: 'AUT' },
  { name: 'Netherlands', coordinates: [4.9041, 52.3676], code: 'NLD' },
  { name: 'Iceland', coordinates: [-21.9426, 64.1466], code: 'ISL' },
];

const visitedCountryCodes = visitedCountries.map((c) => c.code);

export default function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = React.useState(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (event, country) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setHoveredCountry(country);
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        my: { xs: 4, md: 6 },
        p: { xs: 2, md: 4 },
        backgroundColor: 'var(--color-paper)',
        borderRadius: 3,
        border: '2px solid var(--color-border)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Map header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-ink)',
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          World Map
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold)',
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              Visited
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map */}
      <Box
        sx={{
          aspectRatio: '2/1',
          minHeight: { xs: 200, md: 300 },
          '& svg': {
            width: '100%',
            height: '100%',
          },
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [20, 30],
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedCountryCodes.includes(
                    geo.properties.ISO_A3 || geo.id
                  );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseMove={(e) =>
                        isVisited && handleMouseMove(e, geo.properties.name)
                      }
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isVisited
                            ? 'hsl(43, 71%, 43%)'
                            : 'var(--color-border)',
                          stroke: 'var(--color-paper)',
                          strokeWidth: 0.5,
                          outline: 'none',
                          transition: 'fill 0.2s ease',
                        },
                        hover: {
                          fill: isVisited
                            ? 'hsl(43, 71%, 50%)'
                            : 'var(--color-border)',
                          stroke: 'var(--color-paper)',
                          strokeWidth: 0.5,
                          outline: 'none',
                          cursor: isVisited ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: isVisited
                            ? 'hsl(43, 71%, 38%)'
                            : 'var(--color-border)',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Animated markers for each visited country */}
            {visitedCountries.map((country, index) => (
              <Marker
                key={country.code}
                coordinates={country.coordinates}
                onMouseMove={(e) => handleMouseMove(e, country.name)}
                onMouseLeave={handleMouseLeave}
              >
                <circle
                  r={4}
                  fill="var(--color-gold)"
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{
                    cursor: 'pointer',
                    animation: `pulse 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </Box>

      {/* Tooltip */}
      {hoveredCountry && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 30,
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-paper)',
            px: 2,
            py: 1,
            borderRadius: 1,
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {hoveredCountry}
        </Box>
      )}

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.3);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </Box>
  );
}
