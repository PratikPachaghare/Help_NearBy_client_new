import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  console.log(user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;