import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BsBell,
  BsGear,
  BsPersonCircle,
  BsBoxArrowRight,
  BsThreeDots,
  BsChevronDown
} from 'react-icons/bs';

export default function AuthNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center lg:w-64">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z" />
            </svg>
            <span className="text-lg sm:text-xl font-bold text-gray-900">SocialPro</span>
          </Link>
        </div>

        {/* Botões da direita */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notificações */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BsBell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Dropdown de Notificações */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[280px] sm:w-80 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm text-gray-600">
                      Sem notificações no momento
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configurações */}
          <Link
            to="/settings"
            className="p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BsGear className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Menu do Perfil */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BsPersonCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm font-medium hidden sm:block max-w-[150px] truncate">
                {user?.email}
              </span>
              <BsChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {/* Dropdown do Perfil */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <BsPersonCircle className="w-4 h-4" />
                  <span>Seu Perfil</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <BsGear className="w-4 h-4" />
                  <span>Configurações</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <BsBoxArrowRight className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
