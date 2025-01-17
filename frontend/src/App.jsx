import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider 
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import InstagramCallback from './components/Auth/InstagramCallback';
import TwitterCallback from './components/Auth/TwitterCallback';
import LinkedInCallback from './components/Auth/LinkedInCallback';
import { Toaster } from 'react-hot-toast';

// Configuração do router com flags futuras
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/auth/instagram/callback" element={<InstagramCallback />} />
      <Route path="/auth/twitter/callback" element={<TwitterCallback />} />
      <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
