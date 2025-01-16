import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import InstagramCallback from './components/Auth/InstagramCallback';
import TwitterCallback from './components/Auth/TwitterCallback';
import LinkedInCallback from './components/Auth/LinkedInCallback';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/auth/instagram/callback" element={<InstagramCallback />} />
          <Route path="/auth/twitter/callback" element={<TwitterCallback />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
