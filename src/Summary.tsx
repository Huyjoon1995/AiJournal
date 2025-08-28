import { 
  Stack, 
  Typography, 
  Box, 
  Paper, 
  Chip, 
  Fade,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { useState } from "react";

interface SummaryProps {
  mood?: string;
  summary?: string;
  reflection?: string;
  timestamp?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Mood color mapping
const getMoodColor = (mood: string) => {
  const moodLower = mood.toLowerCase();
  if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('excited')) {
    return '#10b981'; // Green
  } else if (moodLower.includes('sad') || moodLower.includes('depressed') || moodLower.includes('melancholy')) {
    return '#3b82f6'; // Blue
  } else if (moodLower.includes('angry') || moodLower.includes('frustrated') || moodLower.includes('irritated')) {
    return '#ef4444'; // Red
  } else if (moodLower.includes('anxious') || moodLower.includes('worried') || moodLower.includes('nervous')) {
    return '#f59e0b'; // Amber
  } else if (moodLower.includes('quota_exceeded') || moodLower.includes('error')) {
    return '#ef4444'; // Red for errors
  } else {
    return '#6b7280'; // Gray
  }
};

export const Summary = ({ 
  mood = "neutral", 
  summary = "No summary available", 
  reflection = "No reflection available",
  timestamp,
  onEdit,
  onDelete
}: SummaryProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fade in={true} timeout={800}>
      <Paper
        elevation={isHovered ? 8 : 2}
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack spacing={3}>
          {/* Header with timestamp and actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📊 Journal Analysis
              </Typography>
              {timestamp && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {timestamp}
                </Typography>
              )}
            </Box>
            
            {/* Action buttons */}
            {(onEdit || onDelete) && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {onEdit && (
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      onClick={onEdit}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
                      }}
                    >
                      ✏️
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      onClick={onDelete}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                      }}
                    >
                      🗑️
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>

          {/* Mood Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              mb: 1.5, 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              😊 Detected Mood
            </Typography>
            <Chip 
              label={mood} 
              sx={{ 
                backgroundColor: getMoodColor(mood),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                py: 0.5,
                '&:hover': {
                  backgroundColor: getMoodColor(mood),
                  opacity: 0.9
                }
              }}
            />
          </Box>

          <Divider sx={{ opacity: 0.6 }} />

          {/* Summary Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              mb: 1.5, 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              📝 Summary
            </Typography>
            <Typography variant="body2" sx={{ 
              lineHeight: 1.6,
              p: 2,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              color: 'text.primary'
            }}>
              {summary}
            </Typography>
          </Box>

          <Divider sx={{ opacity: 0.6 }} />

          {/* Reflection Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              mb: 1.5, 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              💡 AI Reflection
            </Typography>
            <Typography variant="body2" sx={{ 
              lineHeight: 1.6,
              p: 2,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              color: 'text.primary'
            }}>
              {reflection}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );
};