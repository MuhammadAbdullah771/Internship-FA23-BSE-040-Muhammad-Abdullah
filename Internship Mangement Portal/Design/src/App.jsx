import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import ToastProvider from './components/common/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastProvider />
      </AuthProvider>
    </BrowserRouter>
  );
}
