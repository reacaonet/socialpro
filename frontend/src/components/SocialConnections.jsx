import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsLinkedin
} from 'react-icons/bs';
import { loginWithFacebook, initFacebookSDK } from '../services/facebook';
import { initInstagramAuth } from '../services/instagram';
import { initTwitterAuth } from '../services/twitter';
import { initLinkedInAuth } from '../services/linkedin';

export default function SocialConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadConnections();
      initFacebookSDK();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConnections(data.connections || {});
      } else {
        await setDoc(docRef, { connections });
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const handleConnect = async (platform) => {
    setLoading(true);
    try {
      switch (platform) {
        case 'facebook':
          const fbResponse = await loginWithFacebook();
          const userRef = doc(db, 'users', user.uid);
          
          await updateDoc(userRef, {
            'connections.facebook': true,
            'socialAccounts.facebook': {
              accessToken: fbResponse.accessToken,
              userID: fbResponse.userID,
              name: fbResponse.userInfo.name,
              email: fbResponse.userInfo.email
            }
          });

          setConnections(prev => ({
            ...prev,
            facebook: true
          }));
          break;

        case 'instagram':
          const instaAuthUrl = initInstagramAuth();
          window.location.href = instaAuthUrl;
          break;

        case 'twitter':
          const twitterAuthUrl = await initTwitterAuth();
          window.location.href = twitterAuthUrl;
          break;

        case 'linkedin':
          const linkedinAuthUrl = initLinkedInAuth();
          window.location.href = linkedinAuthUrl;
          break;
      }
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: BsFacebook,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      connected: connections.facebook
    },
    {
      name: 'Instagram',
      icon: BsInstagram,
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700',
      connected: connections.instagram
    },
    {
      name: 'Twitter',
      icon: BsTwitter,
      color: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600',
      connected: connections.twitter
    },
    {
      name: 'LinkedIn',
      icon: BsLinkedin,
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
      connected: connections.linkedin
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Conecte suas redes sociais
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleConnect(platform.name.toLowerCase())}
            disabled={loading}
            className={`
              flex items-center justify-center space-x-3 px-4 py-3 rounded-lg
              text-white transition-all duration-200
              ${platform.color} ${platform.hoverColor}
              ${platform.connected ? 'opacity-75' : ''}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <platform.icon className="w-6 h-6" />
            <span className="font-medium">
              {platform.connected ? 'Conectado' : `Conectar ${platform.name}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
