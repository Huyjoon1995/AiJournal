import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" gutterBottom sx={{ fontSize: '6rem', fontWeight: 700, color: 'primary.main' }}>
          404
        </Typography>
        
        <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 4, color: 'text.secondary' }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/')}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Go Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;
