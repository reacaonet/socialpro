import { Link } from 'react-router-dom';
import {
  BsGithub,
  BsLinkedin,
  BsTwitter,
  BsInstagram
} from 'react-icons/bs';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: 'Sobre', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Ajuda', href: '/help' },
      { name: 'Privacidade', href: '/privacy' },
      { name: 'Termos', href: '/terms' }
    ],
    social: [
      {
        name: 'GitHub',
        href: '#',
        icon: BsGithub
      },
      {
        name: 'LinkedIn',
        href: '#',
        icon: BsLinkedin
      },
      {
        name: 'Twitter',
        href: '#',
        icon: BsTwitter
      },
      {
        name: 'Instagram',
        href: '#',
        icon: BsInstagram
      }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link
                to={item.href}
                className="text-base text-gray-500 hover:text-gray-900"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {currentYear} Social Media Manager. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
