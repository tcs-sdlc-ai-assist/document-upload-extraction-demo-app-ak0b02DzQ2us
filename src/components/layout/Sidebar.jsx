import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  Divider,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants';

const DRAWER_WIDTH = 240;

const navItems = [
  {
    label: 'Dashboard',
    icon: <HomeIcon />,
    path: ROUTES.HOME,
  },
  {
    label: 'Upload',
    icon: <CloudUploadIcon />,
    path: ROUTES.UPLOAD,
  },
  {
    label: 'Documents',
    icon: <DescriptionIcon />,
    path: ROUTES.DOCUMENTS,
  },
];

const Sidebar = ({ open, onClose }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      if (isMobile && onClose) {
        onClose();
      }
    },
    [navigate, isMobile, onClose]
  );

  const isActive = useCallback(
    (path) => {
      if (path === ROUTES.HOME) {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  if (!isAuthenticated) {
    return null;
  }

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <Toolbar />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          Navigation
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={active}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(21, 101, 192, 0.12)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  '&:focus-visible': {
                    outline: '2px solid #0D47A1',
                    outlineOffset: 2,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: DRAWER_WIDTH,
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;