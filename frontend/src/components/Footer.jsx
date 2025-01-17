import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin } from 'react-icons/bs';

const navigation = {
  main: [
    { name: 'Sobre', href: '#about' },
    { name: 'Recursos', href: '#features' },
    { name: 'Preços', href: '#pricing' },
    { name: 'Blog', href: '#' },
    { name: 'FAQ', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: BsFacebook,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: BsInstagram,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: BsTwitter,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: BsLinkedin,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-primary">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a key={item.name} href={item.href} className="text-gray-400 hover:text-primary">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} SocialPro. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
