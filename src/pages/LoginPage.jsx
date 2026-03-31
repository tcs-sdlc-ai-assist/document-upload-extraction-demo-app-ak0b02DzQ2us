import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: '80vh',
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;