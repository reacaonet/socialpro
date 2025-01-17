import { useState } from 'react';
import AuthModal from './Auth/AuthModal';
import Navbar from './Navbar';
import Footer from './Footer';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const features = [
    {
      name: 'Agendamento Inteligente',
      description: 'Agende suas postagens com antecedência e mantenha sua presença online consistente.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      name: 'Análise de Desempenho',
      description: 'Acompanhe o engajamento e crescimento das suas redes sociais com métricas detalhadas.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      name: 'Gestão Unificada',
      description: 'Gerencie todas as suas redes sociais em um único lugar de forma simples e eficiente.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
  ];

  const platforms = [
    { name: 'Instagram', users: '2B+' },
    { name: 'Facebook', users: '2.9B+' },
    { name: 'Twitter', users: '400M+' },
    { name: 'LinkedIn', users: '750M+' },
    { name: 'TikTok', users: '1B+' },
  ];

  const pricingPlans = [
    {
      name: 'Básico',
      price: 'R$ 29',
      features: [
        '3 redes sociais',
        'Agendamento de posts',
        'Análise básica',
        'Suporte por email',
      ],
    },
    {
      name: 'Profissional',
      price: 'R$ 79',
      features: [
        '10 redes sociais',
        'Agendamento avançado',
        'Análise completa',
        'Suporte prioritário',
        'Relatórios personalizados',
      ],
      featured: true,
    },
    {
      name: 'Empresarial',
      price: 'R$ 199',
      features: [
        'Redes sociais ilimitadas',
        'Recursos exclusivos',
        'API personalizada',
        'Gerente de conta dedicado',
        'Treinamento da equipe',
      ],
    },
  ];

  return (
    <div className="bg-white">
      <Navbar onLogin={() => setAuthModalOpen(true)} />

      {/* Hero section */}
      <div className="relative isolate">
        {/* Background decorative elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-1 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                  Novidades
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Gerencie suas redes sociais com <span className="text-primary">inteligência</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simplifique sua presença online com nossa plataforma completa de gerenciamento de redes sociais.
              Agende posts, analise resultados e cresça sua audiência.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition duration-150 ease-in-out"
              >
                Comece agora
              </button>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-1">
            <div className="w-full overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000"
                alt="Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Platforms Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-lg font-semibold leading-8 text-primary">
                Integrado com as principais redes sociais
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                {platforms.map((platform) => (
                  <div key={platform.name} className="col-span-1 flex justify-center md:col-span-1 bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-150 ease-in-out">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{platform.name}</div>
                      <div className="mt-1 text-sm text-primary">{platform.users} usuários</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="py-24 sm:py-32 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Recursos</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Tudo que você precisa para gerenciar suas redes sociais
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Nossa plataforma oferece todas as ferramentas necessárias para você gerenciar suas redes sociais de forma profissional e eficiente.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
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

        {/* Pricing section */}
        <div id="pricing" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Planos que se adaptam ao seu negócio</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Escolha o plano ideal para suas necessidades e comece a transformar sua presença nas redes sociais.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
              {pricingPlans.map((plan, planIdx) => (
                <div
                  key={plan.name}
                  className={`${
                    plan.featured
                      ? 'relative p-8 shadow-2xl ring-1 ring-gray-900/10 sm:mx-0 sm:rounded-xl lg:z-10 lg:rounded-b-xl'
                      : 'p-8 lg:p-8'
                  } ${planIdx === 0 ? 'lg:rounded-l-xl' : ''} ${
                    planIdx === pricingPlans.length - 1 ? 'lg:rounded-r-xl' : ''
                  } bg-white`}
                >
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      plan.featured ? 'text-primary' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{plan.price}/mês</p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <BsCheckCircleFill className="h-6 w-5 flex-none text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className={`mt-8 block w-full rounded-md px-4 py-3 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition duration-150 ease-in-out ${
                      plan.featured
                        ? 'bg-primary text-white shadow-sm hover:bg-primary-dark focus-visible:outline-primary'
                        : 'bg-white text-primary ring-1 ring-inset ring-primary hover:bg-primary/5'
                    }`}
                  >
                    Começar agora
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About section */}
        <div id="about" className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Sobre nós</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Somos uma empresa dedicada a simplificar o gerenciamento de redes sociais para empresas e profissionais.
                Nossa missão é ajudar você a alcançar seus objetivos nas redes sociais com menos esforço e mais resultados.
              </p>
            </div>
          </div>
        </div>

        <Footer />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </div>
  );
}
