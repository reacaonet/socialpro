import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getLinkedInToken, getLinkedInUserInfo, getLinkedInCompanyPages } from '../../services/linkedin';
import { toast } from 'react-hot-toast';

export default function LinkedInCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState('Conectando com LinkedIn...');

  useEffect(() => {
    const handleLinkedInCallback = async () => {
      try {
        // Obtém o código e state da URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const error_description = urlParams.get('error_description');

        // Verifica se houve erro na autenticação
        if (error) {
          throw new Error(error_description || 'Erro na autenticação do LinkedIn');
        }
        
        // Verifica se o state corresponde ao que foi salvo
        const savedState = sessionStorage.getItem('linkedin_auth_state');
        if (!savedState || state !== savedState) {
          throw new Error('Estado inválido - possível tentativa de CSRF');
        }

        if (!code || !user) {
          throw new Error('Dados de autenticação inválidos');
        }

        setStatus('Obtendo token de acesso...');
        const tokenData = await getLinkedInToken(code);
        
        setStatus('Obtendo informações do perfil...');
        const userInfo = await getLinkedInUserInfo(tokenData.access_token);

        setStatus('Obtendo páginas empresariais...');
        const companyPages = await getLinkedInCompanyPages(tokenData.access_token);

        setStatus('Salvando informações...');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          'connections.linkedin': true,
          'socialAccounts.linkedin': {
            accessToken: tokenData.access_token,
            expiresIn: tokenData.expires_in,
            refreshToken: tokenData.refresh_token,
            connectedAt: new Date().toISOString(),
            userInfo: {
              id: userInfo.id,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              email: userInfo.email,
              profilePicture: userInfo.profilePictureUrl
            },
            companyPages: companyPages.map(page => ({
              id: page.id,
              name: page.localizedName,
              vanityName: page.vanityName,
              logoUrl: page.logoUrl,
              followers: page.followersCount
            }))
          }
        });

        // Limpa o state do sessionStorage
        sessionStorage.removeItem('linkedin_auth_state');

        toast.success('LinkedIn conectado com sucesso!');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error handling LinkedIn callback:', error);
        toast.error(error.message || 'Erro ao conectar com LinkedIn');
        navigate('/dashboard', { replace: true });
      }
    };

    handleLinkedInCallback();
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
