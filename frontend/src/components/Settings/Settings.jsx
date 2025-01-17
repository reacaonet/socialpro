import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, KeyIcon, UserCircleIcon, ShieldCheckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { toast } from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Perfil', icon: UserCircleIcon },
  { name: 'Empresa', icon: BuildingOfficeIcon },
  { name: 'Notificações', icon: BellIcon },
  { name: 'Segurança', icon: ShieldCheckIcon },
  { name: 'Privacidade', icon: KeyIcon },
];

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    description: ''
  });

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.company) {
            setCompanyData(prev => ({
              ...prev,
              ...userData.company
            }));
          }
        }
      } catch (error) {
        console.error('Error loading company data:', error);
        toast.error('Erro ao carregar dados da empresa');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [user]);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        company: companyData
      });
      toast.success('Dados da empresa atualizados com sucesso!');
    } catch (error) {
      console.error('Error updating company data:', error);
      toast.error('Erro ao atualizar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

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

                {/* Company Settings */}
                <Tab.Panel className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Informações da Empresa</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Configure os dados da sua empresa
                      </p>
                    </div>

                    <form onSubmit={handleCompanySubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nome da Empresa
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="company-name"
                              value={companyData.name}
                              onChange={handleCompanyChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="Nome da sua empresa"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Website
                          </label>
                          <div className="mt-1">
                            <input
                              type="url"
                              name="website"
                              id="company-website"
                              value={companyData.website}
                              onChange={handleCompanyChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="https://exemplo.com"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                            Setor/Indústria
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="industry"
                              id="company-industry"
                              value={companyData.industry}
                              onChange={handleCompanyChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="Ex: Tecnologia, Varejo, etc"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                            Tamanho da Empresa
                          </label>
                          <div className="mt-1">
                            <select
                              name="size"
                              id="company-size"
                              value={companyData.size}
                              onChange={handleCompanyChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              disabled={loading}
                            >
                              <option value="">Selecione...</option>
                              <option value="1-10">1-10 funcionários</option>
                              <option value="11-50">11-50 funcionários</option>
                              <option value="51-200">51-200 funcionários</option>
                              <option value="201-500">201-500 funcionários</option>
                              <option value="501+">501+ funcionários</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Descrição da Empresa
                          </label>
                          <div className="mt-1">
                            <textarea
                              name="description"
                              id="company-description"
                              rows={4}
                              value={companyData.description}
                              onChange={handleCompanyChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="Descreva sua empresa..."
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Salvando...
                            </>
                          ) : 'Salvar Alterações'}
                        </button>
                      </div>
                    </form>
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
