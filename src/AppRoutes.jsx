import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import UserNavigatore from './Navigatore/UserNavigatore';
import WorkerNavigatore from './Navigatore/WorkerNavigatore';
import ShopNavigatore from './Navigatore/shopNavigatore';
import DeliveryNavigatore from './Navigatore/deliveryNavigatore';
import MedicaleNavigatore from './Navigatore/MedicaleNavigatore';
import Footer from './layout/Footer/Footer';


const AppRoutes = () => {
  return (
    <div><Routes>
      {/* Public Routes */}
      <Route path="/login" element={<div>Login Page</div>} />

      {/* User Specific Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        {/* IMPORTANT: path="/" ko "/*" mein badlein */}
        <Route path="/*" element={<UserNavigatore />} />
      </Route>
      {/* Worker Specific Routes */}
      <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
        <Route path="/worker-dashboard" element={<WorkerNavigatore />} />
      </Route>

      {/* Shop Keeper Routes */}
      <Route element={<ProtectedRoute allowedRoles={['shopkeeper']} />}>
        <Route path="/shop-dashboard" element={<ShopNavigatore />} />
      </Route>

      {/* Delivery Routes */}
      <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
        <Route path="/delivery-dashboard" element={<DeliveryNavigatore/>} />
      </Route>

      {/* Midicale Routes */}
      <Route element={<ProtectedRoute allowedRoles={['medical']} />}>
        <Route path="/medical-dashboard" element={<MedicaleNavigatore/>} />
      </Route>

      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
    <Footer/>
    </div>
    
  );
};

export default AppRoutes;