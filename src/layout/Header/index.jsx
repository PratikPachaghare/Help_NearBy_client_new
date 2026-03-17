import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-bar">
      <h2>HelpNearBy</h2>
      <ul>
        {user?.role === 'user' && <li><Link to="/">Home</Link></li>}
        {user?.role === 'worker' && <li><Link to="/worker-dashboard">Worker Panel</Link></li>}
        {user?.role === 'shopkeeper' && <li><Link to="/shop-dashboard">Shop Management</Link></li>}
        {user?.role === 'delivery' && <li><Link to="/delivery-dashboard">Delivery Panel</Link></li>}
        {user?.role === 'medical' && <li><Link to="/medical-dashboard">Medical Panel</Link></li>}
        {user?.role === 'admin' && <li><Link to="/admin-dashboard">Admin Panel</Link></li>}
        
        {user && (
          <li><button onClick={logout}>Logout ({user.role})</button></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;