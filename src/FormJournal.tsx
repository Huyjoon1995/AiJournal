import { 
  Button, 
  Stack, 
  TextareaAutosize, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Fade,
  Alert
} from "@mui/material";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface JournalAnalysis {
    mood: string;
    summary: string;
    reflection: string;
}

interface FormJournalProps {
    onAnalysisComplete?: (analysis: JournalAnalysis, journalText: string) => void;
}

const API_URL = "http://localhost:8000"

export const FormJournal = ({ onAnalysisComplete }: FormJournalProps) => {
    const [journal, setJournal] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { getAccessTokenSilently } = useAuth0();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: "http://localhost:8000",
                }
            });
            const response = await fetch(`${API_URL}/analyze-journal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    journal_text: journal
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Call the callback to save the analysis
                if (onAnalysisComplete) {
                    onAnalysisComplete(data, journal);
                }
                
                // Clear the form
                setJournal("");
                
            } else {
                setError('Failed to analyze journal entry. Please try again.');
                console.error('Error analyzing journal:', response.statusText);
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            console.error('Error calling backend:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJournal(event.currentTarget.value);
        if (error) setError(""); // Clear error when user starts typing
    }

    const characterCount = journal.length;
    const wordCount = journal.trim() ? journal.trim().split(/\s+/).length : 0;

    return (
        <Stack spacing={4} sx={{ width: '100%' }}>
            {/* Journal Form */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: 3
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                ✍️ Write Your Journal Entry
                            </Typography>
                            <TextareaAutosize 
                                minRows={6} 
                                maxRows={12}
                                placeholder="Share your thoughts, feelings, and experiences from today... What's on your mind?" 
                                style={{ 
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    transition: 'border-color 0.2s ease',
                                    outline: 'none'
                                }}
                                value={journal} 
                                onChange={handleTextAreaChange}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#6366f1';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {wordCount} words • {characterCount} characters
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Min. 10 words recommended
                                </Typography>
                            </Box>
                        </Box>

                        <Button 
                            variant="contained" 
                            type="submit"
                            disabled={loading || wordCount < 5}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <span>🧠</span>}
                        >
                            {loading ? 'Analyzing Your Entry...' : 'Analyze with AI'}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Error Message */}
            {error && (
                <Fade in={!!error}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {error}
                    </Alert>
                </Fade>
            )}
            
            {/* Success Message */}
            {!loading && !error && journal === "" && (
                <Fade in={true}>
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                        ✅ Your journal entry has been analyzed! Check the "Journal History" tab to see your results.
                    </Alert>
                </Fade>
            )}
        </Stack>
    )
}