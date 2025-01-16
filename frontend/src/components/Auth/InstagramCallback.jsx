import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getInstagramToken, getInstagramUserInfo } from '../../services/instagram';

export default function InstagramCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleInstagramCallback = async () => {
      try {
        // Obtém o código da URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (code && user) {
          // Troca o código pelo token de acesso
          const tokenData = await getInstagramToken(code);
          
          // Obtém informações do usuário
          const userInfo = await getInstagramUserInfo(tokenData.access_token);

          // Salva as informações no Firestore
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            'connections.instagram': true,
            'socialAccounts.instagram': {
              accessToken: tokenData.access_token,
              userID: userInfo.id,
              username: userInfo.username
            }
          });

          // Redireciona de volta para o dashboard
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error handling Instagram callback:', error);
        navigate('/dashboard', { replace: true });
      }
    };

    handleInstagramCallback();
  }, [location, navigate, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-center text-gray-600">Conectando com Instagram...</p>
      </div>
    </div>
  );
}
