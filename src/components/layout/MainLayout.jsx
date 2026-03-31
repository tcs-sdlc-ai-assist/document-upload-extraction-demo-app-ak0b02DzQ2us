import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 240;

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSidebarOpen = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />

      {isAuthenticated && isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: (t) => t.zIndex.speedDial,
          }}
        >
          <IconButton
            color="primary"
            onClick={handleSidebarOpen}
            aria-label="Open navigation menu"
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:focus-visible': {
                outline: '2px solid #0D47A1',
                outlineOffset: 2,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: 'flex', flex: 1 }}>
        {isAuthenticated && (
          <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
        )}

        <Box
          component="main"
          id="main-content"
          role="main"
          aria-label="Main content"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            width: '100%',
            ml: isAuthenticated && !isMobile ? `${DRAWER_WIDTH}px` : 0,
            transition: 'margin-left 0.2s ease-in-out',
          }}
        >
          <Toolbar />
          <Box
            className="page-container"
            sx={{
              flex: 1,
              width: '100%',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;