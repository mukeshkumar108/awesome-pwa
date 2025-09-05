import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import './index.css';

// Placeholder Pages (we'll create these properly in Phase 3)
const LandingPage = () => <div>Welcome to the PWA!</div>;
const DashboardPage = () => <div>Dashboard Content</div>;
const ProfilePage = () => <div>User Profile</div>;
const LoginPage = () => <div>Login Page</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
