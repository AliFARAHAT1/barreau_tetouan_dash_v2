import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#0969b3]/30  flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};