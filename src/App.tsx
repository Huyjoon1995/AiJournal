import React, { useEffect, useState } from 'react';
import './App.css';
import { FormJournal } from './FormJournal';
import { Summary } from './Summary';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, Tabs, Tab, Typography, Fade } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import TopBar from './TopBar';
import { MonthlySummary } from './MonthlySummary';

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

interface JournalEntry {
  id: string;
  mood: string;
  summary: string;
  reflection: string;
  timestamp: string;
  journalText: string;
}

const API_URL = "http://localhost:8000";
function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const { isAuthenticated, loginWithRedirect, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // If the auth state is loaded and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNewAnalysis = (analysis: any, journalText: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      mood: analysis.mood,
      summary: analysis.summary,
      reflection: analysis.reflection,
      timestamp: new Date().toLocaleString(),
      journalText: journalText
    };
    setJournalHistory([newEntry, ...journalHistory]);
  };

  const handleDeleteEntry = async (id: string) => {
    setJournalHistory(journalHistory.filter(entry => entry.id !== id));
    try {
      const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: API_URL,
          },
        });
        const response = await fetch(`${API_URL}/delete_journal/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.ok) {
          console.log(`Successfully deleted the journal with id: ${id}`);
        } else {
          console.error("Failed to delete journal entry:", id, response.status, response.statusText);
        }
    }
    catch (error) {
       console.error(`Error Delete journal from server: ${error}`);
    }
  };

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: API_URL,
          },
        });

        const response = await fetch(`${API_URL}/journal-entries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched journal entries:", data);
        
          // Convert the API data to the format expected by the frontend
          const formattedEntries: JournalEntry[] = data.map((entry: any) => ({
            id: entry.id.toString(),
            mood: entry.mood,
            summary: entry.summary,
            reflection: entry.reflection,
            timestamp: entry.created_at ? new Date(entry.created_at).toLocaleString() : new Date().toLocaleString(),
            journalText: entry.journal_text
          }));
        
          setJournalHistory(formattedEntries);
        } else {
          console.error("Failed to fetch journal entries:", response.status, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching journal from server: ${error}`);
      }
    };

    if (isAuthenticated) {
      fetchJournal();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

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
        <Container maxWidth="lg">
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
            }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                AI Journal Analyzer
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  fontSize: '1.1rem',
                  mt: 1
                }}
              >
                Write your thoughts and get AI-powered insights about your mood and reflections
              </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 64,
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  }
                }}
              >
                <Tab 
                  label="✍️ Write New Entry" 
                  sx={{ flex: 1 }}
                />
                <Tab 
                  label={`📊 Journal History (${journalHistory.length})`} 
                  sx={{ flex: 1 }}
                />
                <Tab 
                  label="📋 Journal Monthly Summary" 
                  sx={{ flex: 1 }}
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 4 }}>
              {activeTab === 0 && (
                <Fade in={activeTab === 0} timeout={300}>
                  <Box>
                    <FormJournal onAnalysisComplete={handleNewAnalysis} />
                  </Box>
                </Fade>
              )}
              
              {activeTab === 1 && (
                <Fade in={activeTab === 1} timeout={300}>
                  <Box>
                    {journalHistory.length === 0 ? (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        color: 'text.secondary'
                      }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          📝 No Journal Entries Yet
                        </Typography>
                        <Typography variant="body1">
                          Write your first journal entry to see your analysis history here!
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        display: 'grid', 
                        gap: 3,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(400px, 1fr))' }
                      }}>
                        {journalHistory.map((entry) => (
                          <Summary
                            key={entry.id}
                            mood={entry.mood}
                            summary={entry.summary}
                            reflection={entry.reflection}
                            timestamp={entry.timestamp}
                            onDelete={() => handleDeleteEntry(entry.id)}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Fade>
              )}
              {activeTab === 2 && (
                <Fade in={activeTab === 2} timeout={300}>
                  <Box>
                    <MonthlySummary />
                  </Box>
                </Fade>
              )}
              
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
