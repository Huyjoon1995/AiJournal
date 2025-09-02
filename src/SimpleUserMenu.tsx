import React, { useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export const SimpleUserMenu = () => {
  const { user, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    handleClose();
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{ p: 0 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          src={user?.picture}
          alt={user?.name || 'User'}
          sx={{ width: 40, height: 40, cursor: 'pointer' }}
        />
      </IconButton>
      
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 150, mt: 1 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography>Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};




