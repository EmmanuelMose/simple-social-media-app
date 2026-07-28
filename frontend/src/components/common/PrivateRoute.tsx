import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '../../Features/authAPI';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setAuthenticated(false);
      return;
    }
    authAPI.getMe(token)
      .then(() => setAuthenticated(true))
      .catch(() => {
        localStorage.removeItem('token');
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;