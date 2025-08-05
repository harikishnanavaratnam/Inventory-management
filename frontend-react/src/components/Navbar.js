import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Smart Inventory
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Feed</Button>
          <Button color="inherit" component={Link} to="/post">New Post</Button>
          {isAdmin && (
            <Button color="inherit" component={Link} to="/admin/products">Products</Button>
          )}
          {isAdmin ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/admin/login">Admin Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 