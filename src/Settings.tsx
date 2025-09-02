import React from 'react';
import { Box, Container, Typography, Paper, Switch, FormControlLabel, Divider } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Settings
        </Typography>
        
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Preferences
          </Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Email notifications for monthly summaries"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <FormControlLabel
            control={<Switch />}
            label="Dark mode"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Auto-save journal entries"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Privacy
          </Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Share anonymous analytics"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <FormControlLabel
            control={<Switch />}
            label="Allow AI to learn from my entries"
            sx={{ mb: 2, display: 'block' }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
