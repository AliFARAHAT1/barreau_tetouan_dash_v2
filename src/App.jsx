import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { BrowserRouter } from 'react-router-dom';
// import { EditLawyerModal } from './components/dashboard/EditLawyerModal';

const AppContent = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isLoggedIn ? <DashboardPage /> : <LoginPage />;  
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;