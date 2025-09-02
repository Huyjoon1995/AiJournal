import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Settings,
  Logout,
  Person,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';

export const UserProfileDropdown = () => {
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
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* User Info Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
        <Avatar
          src={user?.picture}
          alt={user?.name || 'User'}
          sx={{ width: 32, height: 32, mr: 1 }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {/* Dropdown Button */}
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ml: 1,
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <KeyboardArrowDown />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 1,
            '& .MuiMenuItem-root': {
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Header */}
        <MenuItem sx={{ cursor: 'default', '&:hover': { backgroundColor: 'transparent' } }}>
          <ListItemIcon>
            <Avatar
              src={user?.picture}
              alt={user?.name || 'User'}
              sx={{ width: 40, height: 40 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={user?.name || 'User'}
            secondary={user?.email}
            primaryTypographyProps={{ fontWeight: 600 }}
            secondaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </MenuItem>

        <Divider />

        {/* Profile Option */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        {/* Settings Option */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <Divider />

        {/* Logout Option */}
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </Box>
  );
};




