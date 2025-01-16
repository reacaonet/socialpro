import { Tab } from '@headlessui/react';
import { BsGear, BsBell, BsShield, BsGlobe, BsCreditCard } from 'react-icons/bs';
import Profile from '../Profile/Profile';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Perfil', icon: BsGear, component: Profile },
  { name: 'Notificações', icon: BsBell, component: NotificationsSettings },
  { name: 'Segurança', icon: BsShield, component: SecuritySettings },
  { name: 'Redes Sociais', icon: BsGlobe, component: SocialSettings },
  { name: 'Plano', icon: BsCreditCard, component: BillingSettings }
];

function NotificationsSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: true,
    monthlyReport: false,
    newFeatures: true
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-primary">Notificações</h3>
        <p className="mt-1 text-sm text-gray-500">
          Decida quais notificações você deseja receber.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </p>
            </div>
            <button
              type="button"
              className={classNames(
                value ? 'bg-primary' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
              onClick={() => handleToggle(key)}
            >
              <span
                className={classNames(
                  value ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-primary">Segurança</h3>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas configurações de segurança e autenticação.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Senha Atual
          </label>
          <input
            type="password"
            name="current-password"
            id="current-password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            Nova Senha
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialSettings() {
  const [connections, setConnections] = useState({
    facebook: false,
    twitter: true,
    instagram: false,
    linkedin: true
  });

  const handleConnect = (platform) => {
    setConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-primary">Redes Sociais</h3>
        <p className="mt-1 text-sm text-gray-500">
          Conecte suas redes sociais para gerenciar suas publicações.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(connections).map(([platform, isConnected]) => (
          <div key={platform} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleConnect(platform)}
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isConnected ? 'Conectado' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-primary">Plano e Pagamento</h3>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie seu plano e informações de pagamento.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-primary">Plano Atual</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Plano Básico - $9.99/mês</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Atualizar Plano
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-primary">Método de Pagamento</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>•••• •••• •••• 4242</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Atualizar Método de Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function Settings() {
  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Configurações
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas preferências e configurações da conta.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="p-6">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full py-3 px-6 text-sm font-medium leading-5 rounded-lg',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary ring-white ring-opacity-60',
                      selected
                        ? 'bg-primary text-white shadow'
                        : 'text-gray-700 hover:bg-gray-200'
                    )
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-6">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className="focus:outline-none"
                >
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
