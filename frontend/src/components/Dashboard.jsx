import React from 'react';
import PostManager from './PostManager';
import PostList from './PostList';
import { BsCalendarCheck, BsGraphUp, BsPeople, BsEye } from 'react-icons/bs';

function StatsCard({ title, value, icon: Icon, change }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{value}</h3>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {change >= 0 ? '+' : ''}{change}% desde o último mês
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = [
    {
      title: 'Posts Agendados',
      value: '24',
      icon: BsCalendarCheck,
      change: 12
    },
    {
      title: 'Alcance Total',
      value: '2.4K',
      icon: BsEye,
      change: 8
    },
    {
      title: 'Engajamento',
      value: '14%',
      icon: BsGraphUp,
      change: -2
    },
    {
      title: 'Novos Seguidores',
      value: '156',
      icon: BsPeople,
      change: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Novo Post */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Criar Novo Post</h2>
          <PostManager />
        </div>
      </div>
      
      {/* Posts Recentes */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Posts Recentes</h2>
          <PostList />
        </div>
      </div>
    </div>
  );
}
