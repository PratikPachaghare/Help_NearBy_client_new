import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-bar">
      <h2>MultiService App</h2>
      <ul>
        {!user && <li><Link to="/login">Login</Link></li>}
        
        {user?.role === 'user' && <li><Link to="/">Home</Link></li>}
        {user?.role === 'worker' && <li><Link to="/worker-dashboard">Worker Panel</Link></li>}
        {user?.role === 'shopkeeper' && <li><Link to="/shop-dashboard">Shop Management</Link></li>}
        
        {user && (
          <li><button onClick={logout}>Logout ({user.role})</button></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;