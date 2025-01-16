import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getTwitterToken, getTwitterUserInfo } from '../../services/twitter';

export default function TwitterCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleTwitterCallback = async () => {
      try {
        // Obtém o código e state da URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        // Verifica se o state corresponde ao que foi salvo
        const savedState = localStorage.getItem('twitter_state');
        if (state !== savedState) {
          throw new Error('Estado inválido');
        }

        if (code && user) {
          // Troca o código pelo token de acesso
          const tokenData = await getTwitterToken(code);
          
          // Obtém informações do usuário
          const userInfo = await getTwitterUserInfo(tokenData.access_token);

          // Salva as informações no Firestore
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            'connections.twitter': true,
            'socialAccounts.twitter': {
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
              userID: userInfo.id,
              username: userInfo.username,
              name: userInfo.name
            }
          });

          // Limpa o state do localStorage
          localStorage.removeItem('twitter_state');
          localStorage.removeItem('twitter_code_verifier');

          // Redireciona de volta para o dashboard
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error handling Twitter callback:', error);
        navigate('/dashboard', { replace: true });
      }
    };

    handleTwitterCallback();
  }, [location, navigate, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-center text-gray-600">Conectando com Twitter...</p>
      </div>
    </div>
  );
}
