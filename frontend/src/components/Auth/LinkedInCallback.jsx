import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getLinkedInToken, getLinkedInUserInfo } from '../../services/linkedin';

export default function LinkedInCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      try {
        // Obtém o código e state da URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        // Verifica se o state corresponde ao que foi salvo
        const savedState = localStorage.getItem('linkedin_state');
        if (state !== savedState) {
          throw new Error('Estado inválido');
        }

        if (code && user) {
          // Troca o código pelo token de acesso
          const tokenData = await getLinkedInToken(code);
          
          // Obtém informações do usuário
          const userInfo = await getLinkedInUserInfo(tokenData.access_token);

          // Salva as informações no Firestore
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            'connections.linkedin': true,
            'socialAccounts.linkedin': {
              accessToken: tokenData.access_token,
              expiresIn: tokenData.expires_in,
              userID: userInfo.id,
              firstName: userInfo.localizedFirstName,
              lastName: userInfo.localizedLastName,
              email: userInfo.email
            }
          });

          // Limpa o state do localStorage
          localStorage.removeItem('linkedin_state');

          // Redireciona de volta para o dashboard
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error handling LinkedIn callback:', error);
        navigate('/dashboard', { replace: true });
      }
    };

    handleLinkedInCallback();
  }, [location, navigate, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-center text-gray-600">Conectando com LinkedIn...</p>
      </div>
    </div>
  );
}
