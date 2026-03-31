import { useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ROUTES } from '../../constants';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    showSuccess('Logged out successfully.');
    navigate(ROUTES.HOME);
  }, [logout, showSuccess, navigate]);

  return (
    <AppBar position="sticky" component="header">
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box
          component={RouterLink}
          to={ROUTES.HOME}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            '&:focus-visible': {
              outline: '2px solid #FFFFFF',
              outlineOffset: 2,
              borderRadius: 1,
            },
          }}
          aria-label="Doc Upload Extract - Home"
        >
          <DescriptionIcon sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' },
              whiteSpace: 'nowrap',
            }}
          >
            Doc Upload Extract
          </Typography>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 700,
              display: { xs: 'block', sm: 'none' },
              whiteSpace: 'nowrap',
            }}
          >
            DocExtract
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {isAuthenticated && user ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: { xs: 0, sm: 1 },
                }}
              >
                <AccountCircleIcon
                  sx={{
                    mr: 0.5,
                    fontSize: 20,
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' },
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  aria-label={`Logged in as ${user.username}`}
                >
                  {user.username}
                </Typography>
              </Box>

              <Tooltip title="Log out">
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  aria-label="Log out"
                  sx={{
                    display: { xs: 'inline-flex', sm: 'none' },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>

              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                aria-label="Log out"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                aria-label="Log in"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Log In
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/signup"
                aria-label="Sign up"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;