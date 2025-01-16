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
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notificações</h3>
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
        <h3 className="text-lg font-medium leading-6 text-gray-900">Segurança</h3>
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
            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Atualizar Senha
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
        <h3 className="text-lg font-medium leading-6 text-gray-900">Redes Sociais</h3>
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
              className={classNames(
                isConnected
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
                'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              )}
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
        <h3 className="text-lg font-medium leading-6 text-gray-900">Plano e Pagamento</h3>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie seu plano e informações de pagamento.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Plano Atual</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Plano Básico - $9.99/mês</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Atualizar Plano
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Método de Pagamento</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>•••• •••• •••• 4242</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
    <div className="pl-64 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Configurações
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas preferências e configurações da conta.
            </p>
          </div>

          <Tab.Group>
            <div className="border-b border-gray-200">
              <Tab.List className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? 'border-primary bg-primary text-white'
                          : 'border-transparent text-gray-700 hover:text-primary hover:border-primary',
                        'group inline-flex items-center py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200'
                      )
                    }
                  >
                    <tab.icon className={classNames(
                      'mr-2 h-5 w-5',
                      'transition-colors duration-200'
                    )} />
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
            </div>
            <Tab.Panels className="mt-6 bg-white rounded-lg shadow">
              {tabs.map((tab, idx) => (
                <Tab.Panel 
                  key={idx}
                  className="p-6"
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
