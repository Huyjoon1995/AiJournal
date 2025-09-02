import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const About = () => {
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
          About AI Journal Analyzer
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          Welcome to AI Journal Analyzer, your intelligent companion for self-reflection and emotional awareness. 
          This application combines the power of artificial intelligence with the therapeutic benefits of journaling 
          to help you gain deeper insights into your thoughts, feelings, and patterns.
        </Typography>
        
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          How It Works
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          Simply write your thoughts in our journal interface, and our AI will analyze your entry to identify 
          your mood, provide a summary of key themes, and offer reflective insights. Over time, you'll build 
          a comprehensive history of your emotional journey with detailed analytics and monthly summaries.
        </Typography>
        
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Features
        </Typography>
        
        <Box component="ul" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          <li>AI-powered mood analysis and sentiment detection</li>
          <li>Personalized insights and reflections</li>
          <li>Comprehensive journal history tracking</li>
          <li>Monthly mood analytics and visualizations</li>
          <li>Secure, private journaling experience</li>
          <li>Beautiful, intuitive interface</li>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 4, fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'center' }}>
          Start your journey of self-discovery today with AI Journal Analyzer.
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
