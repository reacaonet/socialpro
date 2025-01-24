// Instagram Graph API Configuration
const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = import.meta.env.VITE_INSTAGRAM_APP_SECRET;
const REDIRECT_URI = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/auth/instagram/callback';

// Instagram Graph API Endpoints
const FACEBOOK_AUTH_URL = 'https://www.facebook.com/v18.0/dialog/oauth';
const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v18.0/oauth/access_token';
const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';

/**
 * Inicia o processo de autenticação do Instagram Business
 * @returns {string} URL de autorização
 */
export const initInstagramAuth = () => {
  const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement';
  const state = Math.random().toString(36).substring(7);
  sessionStorage.setItem('instagram_auth_state', state);
  
  return `${FACEBOOK_AUTH_URL}?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=code&state=${state}`;
};

/**
 * Obtém o token de acesso usando o código de autorização
 * @param {string} code - Código de autorização
 * @returns {Promise<Object>} Dados do token
 */
export const getInstagramToken = async (code) => {
  try {
    // Primeiro, troca o código por um token de acesso
    const tokenUrl = `${FACEBOOK_TOKEN_URL}?client_id=${INSTAGRAM_APP_ID}&client_secret=${INSTAGRAM_APP_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`;
    const response = await fetch(tokenUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Falha ao obter token do Facebook');
    }

    const { access_token } = await response.json();

    // Agora, obtém as páginas do Facebook
    const pagesResponse = await fetch(
      `${GRAPH_API_URL}/me/accounts?access_token=${access_token}`
    );

    if (!pagesResponse.ok) {
      const errorData = await pagesResponse.json();
      throw new Error(errorData.error?.message || 'Falha ao obter páginas do Facebook');
    }

    const pagesData = await pagesResponse.json();
    
    // Para cada página, verifica se há uma conta do Instagram Business conectada
    const instagramAccounts = [];
    for (const page of pagesData.data) {
      const instagramResponse = await fetch(
        `${GRAPH_API_URL}/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      );
      
      if (instagramResponse.ok) {
        const instagramData = await instagramResponse.json();
        if (instagramData.instagram_business_account) {
          instagramAccounts.push({
            pageId: page.id,
            pageName: page.name,
            pageAccessToken: page.access_token,
            instagramAccountId: instagramData.instagram_business_account.id
          });
        }
      }
    }

    return {
      userAccessToken: access_token,
      instagramAccounts
    };
  } catch (error) {
    console.error('Error getting Instagram token:', error);
    throw error;
  }
};

/**
 * Obtém informações da conta business do Instagram
 * @param {string} instagramAccountId - ID da conta do Instagram
 * @param {string} accessToken - Token de acesso
 * @returns {Promise<Object>} Informações da conta
 */
export const getInstagramUserInfo = async (instagramAccountId, accessToken) => {
  try {
    const response = await fetch(
      `${GRAPH_API_URL}/${instagramAccountId}?fields=username,profile_picture_url,name,biography,follows_count,followers_count,media_count&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Falha ao obter informações do Instagram');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Instagram user info:', error);
    throw error;
  }
};

/**
 * Obtém a mídia da conta do Instagram
 * @param {string} instagramAccountId - ID da conta do Instagram
 * @param {string} accessToken - Token de acesso
 * @returns {Promise<Array>} Lista de mídias
 */
export const getInstagramMedia = async (instagramAccountId, accessToken) => {
  try {
    const response = await fetch(
      `${GRAPH_API_URL}/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Falha ao obter mídia do Instagram');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting Instagram media:', error);
    throw error;
  }
};

/**
 * Publica uma mídia no Instagram Business
 * @param {string} instagramAccountId - ID da conta do Instagram
 * @param {string} accessToken - Token de acesso
 * @param {Object} mediaData - Dados da mídia a ser publicada
 * @returns {Promise<Object>} Resultado da publicação
 */
export const publishInstagramMedia = async (instagramAccountId, accessToken, mediaData) => {
  try {
    // Primeiro, cria o container da mídia
    const createContainer = await fetch(
      `${GRAPH_API_URL}/${instagramAccountId}/media?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      }
    );

    if (!createContainer.ok) {
      const errorData = await createContainer.json();
      throw new Error(errorData.error?.message || 'Falha ao criar container de mídia');
    }

    const { id: creation_id } = await createContainer.json();

    // Depois, publica a mídia
    const publishResponse = await fetch(
      `${GRAPH_API_URL}/${instagramAccountId}/media_publish?creation_id=${creation_id}&access_token=${accessToken}`,
      {
        method: 'POST'
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      throw new Error(errorData.error?.message || 'Falha ao publicar mídia');
    }

    return await publishResponse.json();
  } catch (error) {
    console.error('Error publishing Instagram media:', error);
    throw error;
  }
};
