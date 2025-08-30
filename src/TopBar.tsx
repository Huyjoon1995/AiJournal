import { AppBar, Toolbar, Typography, Avatar, Box, Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

function TopBar() {
  const { user, logout } = useAuth0();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          AI Journal Analyzer
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.picture && <Avatar alt={user.name} src={user.picture} />}
          {user?.name && <Typography>{user.name}</Typography>}
          <Button
            color="primary"
            variant="outlined"
            onClick={() =>  logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;