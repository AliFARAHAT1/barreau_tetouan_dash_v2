import { LogOut, Users, FileText, BookOpen, Bell, File, Lightbulb, Settings, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  Users,
  FileText,
  BookOpen,
  Bell,
  File,
  Lightbulb,
  Settings,
  Mail
};

export const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-80 bg-gradient-to-b from-[#134262] to-[#0d2f45] text-white p-5 shadow-2xl">
      <div className="text-center mb-8 pb-6 border-b border-[#1e5573]">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-3">
          <div className="relative">
            <div className="text-white text-5xl font-bold">M</div>
            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-3 border-[#CAAA5C] rounded-full"></div>
          </div>
        </div>
        <div className="text-[#CAAA5C] text-sm">هيئة المحامين بطنجة</div>
      </div>

      <nav className="space-y-2">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-[#CAAA5C] hover:bg-[#b8954a] shadow-lg text-white'
                  : 'hover:bg-[#1e5573]'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full mt-8 flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#CAAA5C] to-[#b8954a] rounded-lg hover:from-[#b8954a] hover:to-[#a68440] transition-all duration-300 shadow-lg"
      >
        <LogOut size={20} />
        <span className="font-medium">تسجيل الخروج</span>
      </button>
    </div>
  );
};