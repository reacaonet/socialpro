import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, KeyIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Perfil', icon: UserCircleIcon },
  { name: 'Notificações', icon: BellIcon },
  { name: 'Segurança', icon: ShieldCheckIcon },
  { name: 'Privacidade', icon: KeyIcon },
];

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="pb-5 sm:pb-8">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Configurações</h1>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Gerencie suas preferências e configurações de conta
            </p>
          </div>

          {/* Settings Tabs */}
          <div className="mt-6">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex flex-wrap gap-2 sm:gap-1">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'flex-1 min-w-[120px] sm:min-w-0 rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white text-primary shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
                      )
                    }
                  >
                    <div className="flex items-center justify-center gap-2">
                      <tab.icon className="h-5 w-5" aria-hidden="true" />
                      <span>{tab.name}</span>
                    </div>
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="mt-8">
                {/* Profile Settings */}
                <Tab.Panel className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Informações do Perfil</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Atualize suas informações pessoais e foto de perfil
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nome
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            defaultValue={user?.displayName || ''}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            defaultValue={user?.email || ''}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Notification Settings */}
                <Tab.Panel className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Preferências de Notificação</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Escolha como e quando deseja receber notificações
                      </p>
                    </div>

                    <div className="space-y-4">
                      {['email', 'push', 'sms'].map((type) => (
                        <div key={type} className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id={`notifications-${type}`}
                              name={`notifications-${type}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="ml-3">
                            <label
                              htmlFor={`notifications-${type}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              {type === 'email'
                                ? 'Notificações por Email'
                                : type === 'push'
                                ? 'Notificações Push'
                                : 'Notificações SMS'}
                            </label>
                            <p className="text-sm text-gray-500">
                              Receba atualizações sobre suas postagens e engajamento
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Security Settings */}
                <Tab.Panel className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Segurança da Conta</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Gerencie sua senha e configurações de autenticação
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Senha Atual
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          Nova Senha
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Privacy Settings */}
                <Tab.Panel className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações de Privacidade</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Controle quem pode ver seu perfil e interagir com suas postagens
                      </p>
                    </div>

                    <div className="space-y-4">
                      {['profile', 'posts', 'followers'].map((setting) => (
                        <div key={setting} className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id={`privacy-${setting}`}
                              name={`privacy-${setting}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="ml-3">
                            <label
                              htmlFor={`privacy-${setting}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              {setting === 'profile'
                                ? 'Perfil Privado'
                                : setting === 'posts'
                                ? 'Posts Privados'
                                : 'Lista de Seguidores Privada'}
                            </label>
                            <p className="text-sm text-gray-500">
                              Apenas seguidores aprovados podem ver seu conteúdo
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
