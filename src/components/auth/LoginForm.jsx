import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { LogOut, Users } from "lucide-react";
import { db, auth } from "../../config/firebase";
import { AUTH_CONFIG, COLLECTIONS, ERROR_MESSAGES } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";

export const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError("");
    setIsLoading(true);

    try {
      const fullEmail = `${username}${AUTH_CONFIG.EMAIL_DOMAIN}`;

      await signInWithEmailAndPassword(auth, fullEmail, password);

      const adminDocRef = doc(db, COLLECTIONS.ADMINS, fullEmail);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        const role = adminDoc.data().role;
        if (role === 0 || role === 2) {
          login();
        } else {
          setError("لا تملك صلاحيات الدخول لهذا النظام");
        }
      } else {
        setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);

      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      } else {
        setError(ERROR_MESSAGES.LOGIN_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-60 h-60 object-contain"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-8">
        يرجى تسجيل الدخول
      </h2>

      <div className="space-y-6">
        <div>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اسم المستخدم"
              className="w-full px-4 py-3 pr-12 bg-white/90 border-2 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none  text-right"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0969b3]">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="كلمة المرور"
              className="w-full px-4 py-3 pr-12 bg-white/90 border-2 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none  text-right"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0969b3]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* <div className="text-center">
          <a href="#" className="text-[#CAAA5C] text-sm hover:text-[#b8954a]">
            هل نسيت كلمة مرور؟
          </a>
        </div> */}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:from-[#b8954a] hover:to-[#a68440] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <LogOut size={20} className="rotate-180" />
              <span>تسجيل الدخول</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
