import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TopBar from './TopBar';

// Create a beautiful theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo
    },
    secondary: {
      main: '#8b5cf6', // Purple
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const Layout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
