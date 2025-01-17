import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { initFacebookSDK, loginWithFacebook, getConnectedPages } from '../../services/facebook';
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
    scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: BsInstagram,
    color: '#E4405F',
    scope: 'instagram_basic,instagram_content_publish'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: BsTwitter,
    color: '#1DA1F2',
    scope: 'tweet.read,tweet.write,users.read'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: BsLinkedin,
    color: '#0A66C2',
    scope: 'r_liteprofile,r_emailaddress,w_member_social'
  }
];

export default function SocialMediaDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState({});
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const loadConnections = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setConnections(userData.socialConnections || {});
          
          // Se tiver conexão com Facebook, carrega as páginas
          if (userData.socialConnections?.facebook) {
            await loadFacebookPages();
          }
        }
      } catch (error) {
        console.error('Error loading social connections:', error);
        toast.error('Erro ao carregar conexões');
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [user]);

  const loadFacebookPages = async () => {
    try {
      await initFacebookSDK();
      const pages = await getConnectedPages();
      setPages(pages);
    } catch (error) {
      console.error('Error loading Facebook pages:', error);
      toast.error('Erro ao carregar páginas do Facebook');
    }
  };

  const handleConnect = async (network) => {
    try {
      setLoading(true);
      let connectionData = null;

      switch (network.id) {
        case 'facebook':
          await initFacebookSDK();
          connectionData = await loginWithFacebook();
          // Carrega páginas após conectar
          await loadFacebookPages();
          break;
        // Adicionar outros casos para outras redes
      }

      if (connectionData) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          [`socialConnections.${network.id}`]: {
            ...connectionData,
            connectedAt: new Date().toISOString()
          }
        });

        setConnections(prev => ({
          ...prev,
          [network.id]: connectionData
        }));

        toast.success(`${network.name} conectado com sucesso!`);
      }
    } catch (error) {
      console.error(`Error connecting to ${network.name}:`, error);
      toast.error(`Erro ao conectar com ${network.name}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (network) => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      
      // Remove a conexão do Firestore
      await updateDoc(userRef, {
        [`socialConnections.${network.id}`]: null
      });

      // Atualiza o estado local
      setConnections(prev => {
        const newConnections = { ...prev };
        delete newConnections[network.id];
        return newConnections;
      });

      if (network.id === 'facebook') {
        setPages([]);
      }

      toast.success(`${network.name} desconectado com sucesso!`);
    } catch (error) {
      console.error(`Error disconnecting from ${network.name}:`, error);
      toast.error(`Erro ao desconectar do ${network.name}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Redes Sociais Conectadas
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas conexões com redes sociais
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {socialNetworks.map(network => {
          const isConnected = !!connections[network.id];
          const NetworkIcon = network.icon;

          return (
            <div
              key={network.id}
              className="relative bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Status Indicator */}
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
                    <p className="text-sm text-gray-500">
                      {isConnected ? 'Conectado' : 'Não conectado'}
                    </p>
                  </div>
                </div>

                {isConnected && network.id === 'facebook' && pages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Páginas Conectadas:</h4>
                    <ul className="mt-2 space-y-2">
                      {pages.map(page => (
                        <li key={page.id} className="text-sm text-gray-600">
                          • {page.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => isConnected ? handleDisconnect(network) : handleConnect(network)}
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: network.color,
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <>
                        <BsArrowRepeat className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Processando...
                      </>
                    ) : isConnected ? (
                      'Desconectar'
                    ) : (
                      'Conectar'
                    )}
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
