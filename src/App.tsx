import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthProvider } from './contexts/AuthContext';
import { store, persistor } from './store/store';
import './App.css';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import IntervieweePage from './pages/IntervieweePage';
import InterviewerPage from './pages/InterviewerPage';
import ProfilePage from './pages/profile';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/Layout';

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interviewee" element={<IntervieweePage />} />
        <Route path="/interviewer" element={<InterviewerPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 4,
            },
          }}
        >
          <AntdApp>
            <Router>
              <AuthProvider>
                <AppLayout>
                  <AppContent />
                </AppLayout>
              </AuthProvider>
            </Router>
          </AntdApp>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
