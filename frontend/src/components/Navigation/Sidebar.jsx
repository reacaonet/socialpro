import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BsGrid1X2,
  BsCalendarEvent,
  BsBarChart,
  BsCollection,
  BsPeople,
  BsGear,
  BsChevronLeft,
  BsChevronRight,
  BsFilePost,
  BsHash,
  BsClock,
  BsList,
  BsX
} from 'react-icons/bs';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      icon: BsGrid1X2,
      href: '/dashboard',
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Posts',
      icon: BsFilePost,
      href: '/posts',
      current: location.pathname === '/posts'
    },
    {
      name: 'Calendário',
      icon: BsCalendarEvent,
      href: '/calendar',
      current: location.pathname === '/calendar'
    },
    {
      name: 'Analytics',
      icon: BsBarChart,
      href: '/analytics',
      current: location.pathname === '/analytics'
    },
    {
      name: 'Mídia',
      icon: BsCollection,
      href: '/media',
      current: location.pathname === '/media'
    },
    {
      name: 'Hashtags',
      icon: BsHash,
      href: '/hashtags',
      current: location.pathname === '/hashtags'
    },
    {
      name: 'Agendamentos',
      icon: BsClock,
      href: '/schedules',
      current: location.pathname === '/schedules'
    },
    {
      name: 'Equipe',
      icon: BsPeople,
      href: '/team',
      current: location.pathname === '/team'
    }
  ];

  const bottomNavigation = [
    {
      name: 'Configurações',
      icon: BsGear,
      href: '/settings',
      current: location.pathname === '/settings'
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-3 left-4 z-50 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="sr-only">Abrir menu</span>
        <BsList className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 transform bg-white transition-all duration-300 ease-in-out
          border-r border-gray-200
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z" />
            </svg>
            {!collapsed && <span className="text-xl font-bold text-gray-900">SocialPro</span>}
          </Link>
          
          {/* Mobile close button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BsX className="h-6 w-6" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 rounded-full hover:bg-gray-100"
          >
            {collapsed ? (
              <BsChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <BsChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100vh-4rem)] px-4 pb-4">
          <div className="flex-1 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-150 ease-in-out
                  ${item.current
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={`flex-shrink-0 w-5 h-5 ${item.current ? 'text-white' : 'text-gray-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 pt-4 space-y-1">
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-150 ease-in-out
                  ${item.current
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={`flex-shrink-0 w-5 h-5 ${item.current ? 'text-white' : 'text-gray-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
