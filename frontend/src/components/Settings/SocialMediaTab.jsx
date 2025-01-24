import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { initFacebookSDK, loginWithFacebook } from '../../services/facebook';
import { initLinkedInAuth } from '../../services/linkedin';
import { initInstagramAuth } from '../../services/instagram';
import { toast } from 'react-hot-toast';
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsLinkedin,
  BsCheckCircleFill,
  BsXCircleFill,
  BsArrowRepeat
} from 'react-icons/bs';

const socialNetworks = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: BsFacebook,
    color: '#1877F2',
    description: 'Conecte suas páginas do Facebook para gerenciar posts e interações'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: BsInstagram,
    color: '#E4405F',
    description: 'Gerencie seu perfil profissional do Instagram'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: BsTwitter,
    color: '#1DA1F2',
    description: 'Compartilhe e interaja com sua audiência no Twitter'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: BsLinkedin,
    color: '#0A66C2',
    description: 'Conecte seu perfil profissional e página empresarial do LinkedIn'
  }
];

export default function SocialMediaTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState({});

  useEffect(() => {
    const loadConnections = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setConnections(userData.connections || {});
        }
      } catch (error) {
        console.error('Error loading social connections:', error);
        toast.error('Erro ao carregar conexões');
      }
    };

    loadConnections();
  }, [user]);

  const handleConnect = async (network) => {
    try {
      setLoading(true);

      switch (network.id) {
        case 'facebook':
          await initFacebookSDK();
          await loginWithFacebook();
          break;
        case 'instagram':
          window.location.href = initInstagramAuth();
          break;
        case 'linkedin':
          window.location.href = initLinkedInAuth();
          break;
        default:
          toast.error('Rede social ainda não suportada');
      }
    } catch (error) {
      console.error(`Error connecting to ${network.name}:`, error);
      toast.error(`Erro ao conectar com ${network.name}`);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionStatus = (networkId) => {
    const connection = connections[networkId];
    if (!connection) return null;

    switch (networkId) {
      case 'facebook':
        return connection.pages?.length > 0
          ? `${connection.pages.length} página${connection.pages.length > 1 ? 's' : ''} conectada${connection.pages.length > 1 ? 's' : ''}`
          : 'Conectado';
      case 'instagram':
        return connection.username ? `@${connection.username}` : 'Conectado';
      case 'linkedin':
        return connection.companyPages?.length > 0
          ? `${connection.companyPages.length} página${connection.companyPages.length > 1 ? 's' : ''} conectada${connection.companyPages.length > 1 ? 's' : ''}`
          : 'Conectado';
      default:
        return 'Conectado';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Redes Sociais</h3>
        <p className="mt-1 text-sm text-gray-500">
          Conecte e gerencie suas redes sociais
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {socialNetworks.map((network) => {
          const isConnected = !!connections[network.id];
          const status = getConnectionStatus(network.id);
          const NetworkIcon = network.icon;

          return (
            <div
              key={network.id}
              className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="absolute top-4 right-4">
                {isConnected ? (
                  <BsCheckCircleFill className="w-5 h-5 text-green-500" />
                ) : (
                  <BsXCircleFill className="w-5 h-5 text-gray-300" />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <NetworkIcon 
                    className="w-8 h-8" 
                    style={{ color: network.color }} 
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {network.name}
                    </h3>
                    {status && (
                      <p className="text-sm text-gray-500">{status}</p>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {network.description}
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => handleConnect(network)}
                    disabled={loading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                      ${isConnected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <BsArrowRepeat className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {isConnected ? 'Reconectar' : 'Conectar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
