import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // TESTING KE LIYE: Default user state set karein
  const [user, setUser] = useState({
    id: "123",
    name: "Test User",
    role: "delivery" // Isse ProtectedRoute 'user' roles allow karega
  }); 

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);