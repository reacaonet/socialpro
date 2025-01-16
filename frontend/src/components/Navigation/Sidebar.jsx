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
  BsClock
} from 'react-icons/bs';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
    <div
      className={`
        fixed left-0 z-40 h-screen bg-white border-r border-gray-200
        transition-width duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1 shadow-sm"
      >
        {collapsed ? (
          <BsChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <BsChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className="flex flex-col h-full pt-20 pb-4">
        {/* User Info */}
        {!collapsed && (
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                {user?.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Plano Básico
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${item.current
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon
                className={`
                  ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}
                  ${item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-500'}
                  ${collapsed ? 'mx-auto' : 'mr-3'}
                `}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-2 space-y-1">
          {bottomNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${item.current
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon
                className={`
                  ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}
                  ${item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-500'}
                  ${collapsed ? 'mx-auto' : 'mr-3'}
                `}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
