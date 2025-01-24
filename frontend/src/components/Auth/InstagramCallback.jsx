import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getInstagramToken, getInstagramUserInfo } from '../../services/instagram';
import toast from 'react-hot-toast';

export default function InstagramCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState('Conectando com Instagram...');

  useEffect(() => {
    const handleInstagramCallback = async () => {
      try {
        // Obtém o código e state da URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const error_description = urlParams.get('error_description');

        // Verifica se houve erro na autenticação
        if (error) {
          throw new Error(error_description || 'Erro na autenticação do Instagram');
        }

        // Verifica o state para prevenir CSRF
        const savedState = sessionStorage.getItem('instagram_auth_state');
        if (state !== savedState) {
          throw new Error('Estado inválido - possível tentativa de CSRF');
        }

        if (!code || !user) {
          throw new Error('Dados de autenticação inválidos');
        }

        setStatus('Obtendo tokens de acesso...');
        const tokenData = await getInstagramToken(code);

        if (!tokenData.instagramAccounts || tokenData.instagramAccounts.length === 0) {
          throw new Error('Nenhuma conta business do Instagram encontrada. Certifique-se de que sua página do Facebook está conectada a uma conta business do Instagram.');
        }

        // Por enquanto, vamos usar a primeira conta do Instagram encontrada
        const instagramAccount = tokenData.instagramAccounts[0];
        
        setStatus('Obtendo informações do Instagram...');
        const userInfo = await getInstagramUserInfo(instagramAccount.instagramAccountId, instagramAccount.pageAccessToken);

        setStatus('Salvando informações...');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          'connections.instagram': true,
          'socialAccounts.instagram': {
            accessToken: instagramAccount.pageAccessToken,
            userAccessToken: tokenData.userAccessToken,
            pageId: instagramAccount.pageId,
            pageName: instagramAccount.pageName,
            instagramAccountId: instagramAccount.instagramAccountId,
            username: userInfo.username,
            name: userInfo.name,
            profilePicture: userInfo.profile_picture_url,
            followersCount: userInfo.followers_count,
            followsCount: userInfo.follows_count,
            mediaCount: userInfo.media_count,
            biography: userInfo.biography,
            connectedAt: new Date().toISOString()
          }
        });

        toast.success('Conta do Instagram conectada com sucesso!');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error handling Instagram callback:', error);
        toast.error(error.message || 'Erro ao conectar com Instagram');
        navigate('/dashboard', { replace: true });
      } finally {
        // Limpa o state do sessionStorage
        sessionStorage.removeItem('instagram_auth_state');
      }
    };

    handleInstagramCallback();
  }, [location, navigate, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor, aguarde enquanto processamos sua autenticação
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
