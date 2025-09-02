import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useLocation, useNavigate } from "react-router-dom";

function TopBar() {
  const { user, isLoading } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  
  if(isLoading || !user) return null;

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => navigate('/')}
          >
            AI Journal Analyzer
          </Typography>
          
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: location.pathname === '/' ? 'primary.main' : 'inherit',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Home
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate('/about')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: location.pathname === '/about' ? 'primary.main' : 'inherit',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            About
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate('/settings')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: location.pathname === '/settings' ? 'primary.main' : 'inherit',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Settings
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <UserProfileDropdown />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
