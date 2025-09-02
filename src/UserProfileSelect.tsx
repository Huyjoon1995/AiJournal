import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const UserProfileSelect = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth0();
  const [selectedValue, setSelectedValue] = useState<string>('profile');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (value === 'preferences') {
      navigate("/preferences");
    }
    
    if (value === 'logout') {
      logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <Select
        value={selectedValue}
        onChange={handleChange}
        displayEmpty
        renderValue={(value) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={user?.picture}
              alt={user?.name || 'User'}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        )}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            py: 1,
          },
        }}
      >
        <MenuItem value="Prefences">
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
              ⚙️
            </Avatar>
            <Typography>Preferences</Typography>
          </Box>
        </MenuItem>
        <MenuItem value="logout" sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'error.main' }}>
              🚪
            </Avatar>
            <Typography>Logout</Typography>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};




