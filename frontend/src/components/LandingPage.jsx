import { useState } from 'react';
import { ChartBarIcon, ClockIcon, ShareIcon, GlobeAltIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Navbar from './Navbar';
import AuthModal from './Auth/AuthModal';

export default function LandingPage() {
  const features = [
    {
      name: 'Gerenciamento Centralizado',
      description: 'Gerencie todas suas redes sociais em um único lugar, com interface intuitiva e fácil de usar.',
      icon: GlobeAltIcon,
    },
    {
      name: 'Agendamento Inteligente',
      description: 'Agende posts para os melhores horários com nossa tecnologia de IA que analisa o melhor momento para publicação.',
      icon: ClockIcon,
    },
    {
      name: 'Análise de Desempenho',
      description: 'Acompanhe métricas e resultados em tempo real com dashboards personalizados e relatórios detalhados.',
      icon: ChartBarIcon,
    },
    {
      name: 'Multi-plataforma',
      description: 'Poste simultaneamente em várias redes sociais como Instagram, Facebook, Twitter, LinkedIn e TikTok.',
      icon: ShareIcon,
    },
  ];

  const platforms = [
    { name: 'Instagram', users: '2B+' },
    { name: 'Facebook', users: '2.9B+' },
    { name: 'Twitter', users: '400M+' },
    { name: 'LinkedIn', users: '750M+' },
    { name: 'TikTok', users: '1B+' },
  ];

  const pricing = [
    {
      name: 'Básico',
      price: 'R$ 49',
      features: [
        '3 redes sociais',
        '100 posts agendados',
        'Análise básica',
        'Suporte por email'
      ]
    },
    {
      name: 'Profissional',
      price: 'R$ 99',
      features: [
        'Redes sociais ilimitadas',
        'Posts ilimitados',
        'Análise avançada',
        'Suporte prioritário',
        'API access'
      ]
    }
  ];

  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Hero Section com gradiente e animação */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Gerencie suas redes sociais com{' '}
              <span className="text-primary">inteligência</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Uma plataforma única e inteligente para criar, agendar e analisar seus posts em todas as redes sociais. 
              Aumente seu alcance e engajamento com nossa tecnologia de IA.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
              >
                Começar agora
              </button>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 group">
                Ver recursos{' '}
                <ArrowRightIcon className="inline-block w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10 bg-white p-8">
                <div className="grid grid-cols-12 gap-6">
                  {/* Sidebar */}
                  <div className="col-span-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-8">
                      <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                      <span className="text-xl font-bold text-gray-900">SocialPro</span>
                    </div>
                    <nav className="space-y-2">
                      {['Dashboard', 'Calendário', 'Analytics', 'Posts', 'Configurações'].map((item) => (
                        <div key={item} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Main Content */}
                  <div className="col-span-9 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all">
                        Novo Post
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Posts Agendados', value: '24' },
                        { label: 'Alcance Total', value: '12.5k' },
                        { label: 'Engajamento', value: '8.2%' }
                      ].map((stat) => (
                        <div key={stat.label} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-primary"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Post #{i}</p>
                                <p className="text-xs text-gray-500">Agendado para hoje</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                              Instagram
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>14:30</span>
                            <div className="flex items-center space-x-2">
                              <span>❤️ 1.2k</span>
                              <span>💬 234</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plataformas Suportadas */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
            <div className="mx-auto w-full max-w-xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Alcance bilhões de usuários</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Conecte-se com seu público em todas as principais redes sociais através de uma única plataforma.
              </p>
            </div>
            <div className="mx-auto grid w-full max-w-xl grid-cols-2 items-center gap-y-12 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:pl-8">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-x-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <ShareIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-900">{platform.name}</div>
                    <div className="mt-1 text-sm text-gray-600">{platform.users} usuários</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section com cards modernos */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Gerencie Melhor</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tudo que você precisa para suas redes sociais
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-200">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Planos que cabem no seu bolso</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Escolha o plano ideal para o seu negócio e comece a crescer nas redes sociais.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            {pricing.map((plan, planIdx) => (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                  planIdx === 1 ? 'sm:z-10 sm:rounded-l-none' : 'sm:z-0 sm:rounded-r-none'
                }`}
              >
                <div>
                  <h3 className="text-base font-semibold leading-7 text-primary">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                    <span className="text-base font-semibold leading-7 text-gray-600">/mês</span>
                  </div>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckCircleIcon className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#"
                  className={`mt-8 block rounded-md px-3.5 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    ${
                      planIdx === 1
                        ? 'bg-primary text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-primary'
                        : 'text-primary ring-1 ring-inset ring-primary hover:ring-indigo-500'
                    }`}
                >
                  Começar agora
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2024 Social Media Manager. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
}
