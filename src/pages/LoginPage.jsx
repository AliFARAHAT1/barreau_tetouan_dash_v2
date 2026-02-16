import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#134262] to-[#0d2f45] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};