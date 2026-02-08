import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './utils/ProtectedRoute';
import UserNavigatore from './Navigatore/UserNavigatore';
import WorkerNavigatore from './Navigatore/WorkerNavigatore';

import MedicaleNavigatore from './Navigatore/MedicaleNavigatore';
import Footer from './layout/Footer/Footer';
import ShopNavigatore from './Navigatore/ShopNavigatore';
import { useAuth } from './utils/AuthContext';
import DeliveryNavigator from './Navigatore/deliveryNavigatore';

// Ye component check karega ki user kaun hai aur usse sahi jagah bhejega
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  
  // Role ke hisab se redirect karo
  if (user.role === 'user') return <UserNavigatore />; // User wahi rahega
  if (user.role === 'shopkeeper') return <Navigate to="/shop-dashboard" replace />;
  if (user.role === 'worker') return <Navigate to="/worker-dashboard" replace />;
  if (user.role === 'delivery') return <Navigate to="/delivery-dashboard" replace />;
  if (user.role === 'medical') return <Navigate to="/medical-dashboard" replace />;

  return <div>Unknown Role</div>;
};

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<div>Login Page</div>} />

        {/* ROOT PATH HANDLER (Ye imp hai) */}
        {/* Agar banda "/" par aata hai, to ye decide karega kahan bhejna hai */}
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* User Specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
           {/* Note: Agar user ka main page alag hai to yahan bhi path change karein */}
           <Route path="/*" element={<UserNavigatore />} />
        </Route>

        {/* Shop Keeper Routes */}
        <Route element={<ProtectedRoute allowedRoles={['shopkeeper']} />}>
           {/* IMPORTANT: path ke peeche '/*' lagayein taaki andar ke pages (analytics/billing) chalein */}
           <Route path="/shop-dashboard/*" element={<ShopNavigatore/>} />
        </Route>

        {/* Worker Specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
           <Route path="/worker-dashboard/*" element={<WorkerNavigatore />} />
        </Route>

        {/* Delivery Routes */}
        <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
           <Route path="/delivery-dashboard/*" element={<DeliveryNavigator/>} />
        </Route>

        {/* Medical Routes */}
        <Route element={<ProtectedRoute allowedRoles={['medical']} />}>
           <Route path="/medical-dashboard/*" element={<MedicaleNavigatore/>} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
      
      <Footer/>
    </div>
  );
};

export default AppRoutes;