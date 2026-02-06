import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main >
          <AppRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;