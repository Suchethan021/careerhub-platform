import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './index.css';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { NotFound } from './pages/NotFound';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';

export function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
          
        </AuthProvider>
      </Router>
    </ErrorBoundary>
    
  );
}

export default App;
