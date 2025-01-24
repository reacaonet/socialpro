// LinkedIn API Configuration
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'https://socialpro-wine.vercel.app/auth/linkedin/callback';

// LinkedIn API Endpoints
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

/**
 * Inicia o processo de autenticação do LinkedIn
 * @returns {string} URL de autorização
 */
export const initLinkedInAuth = () => {
  const state = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('linkedin_auth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: 'r_liteprofile r_emailaddress w_member_social r_organization_social w_organization_social rw_organization_admin'
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

/**
 * Obtém o token de acesso usando o código de autorização
 * @param {string} code - Código de autorização
 * @returns {Promise<Object>} Dados do token
 */
export const getLinkedInToken = async (code) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET
  });

  try {
    const response = await fetch(LINKEDIN_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Falha ao obter token do LinkedIn');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting LinkedIn token:', error);
    throw error;
  }
};

/**
 * Obtém informações do usuário do LinkedIn
 * @param {string} accessToken - Token de acesso
 * @returns {Promise<Object>} Informações do usuário
 */
export const getLinkedInUserInfo = async (accessToken) => {
  try {
    // Obtém informações básicas do perfil
    const profileResponse = await fetch(`${LINKEDIN_API_URL}/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Obtém email
    const emailResponse = await fetch(`${LINKEDIN_API_URL}/emailAddress?q=members&projection=(elements*(handle~))`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok || !emailResponse.ok) {
      throw new Error('Falha ao obter informações do usuário do LinkedIn');
    }

    const profileData = await profileResponse.json();
    const emailData = await emailResponse.json();

    // Pega a URL da maior imagem disponível
    let profilePictureUrl = null;
    if (profileData.profilePicture?.['displayImage~']?.elements) {
      const images = profileData.profilePicture['displayImage~'].elements;
      const largestImage = images[images.length - 1];
      profilePictureUrl = largestImage?.identifiers[0]?.identifier;
    }

    // Extrai o email do usuário
    const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

    return {
      id: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: email,
      profilePictureUrl: profilePictureUrl
    };
  } catch (error) {
    console.error('Error getting LinkedIn user info:', error);
    throw error;
  }
};

/**
 * Obtém as páginas da empresa do usuário
 * @param {string} accessToken - Token de acesso
 * @returns {Promise<Array>} Lista de páginas da empresa
 */
export const getLinkedInCompanyPages = async (accessToken) => {
  try {
    // Primeiro, obtém a lista de organizações administradas pelo usuário
    const response = await fetch(
      `${LINKEDIN_API_URL}/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(localizedName,vanityName,logoV2(original~:playableStreams),id,followersCount)))`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao obter páginas da empresa do LinkedIn');
    }

    const data = await response.json();
    const pages = data.elements?.map(element => {
      const org = element['organizationalTarget~'];
      let logoUrl = null;
      
      if (org.logoV2?.['original~']?.elements) {
        const images = org.logoV2['original~'].elements;
        const largestImage = images[images.length - 1];
        logoUrl = largestImage?.identifiers[0]?.identifier;
      }

      return {
        id: org.id,
        localizedName: org.localizedName,
        vanityName: org.vanityName,
        logoUrl: logoUrl,
        followersCount: org.followersCount || 0
      };
    }) || [];

    return pages;
  } catch (error) {
    console.error('Error getting LinkedIn company pages:', error);
    throw error;
  }
};

/**
 * Cria uma postagem no LinkedIn
 * @param {string} accessToken - Token de acesso
 * @param {Object} postData - Dados da postagem
 * @param {string} postData.text - Texto da postagem
 * @param {string} [postData.organizationId] - ID da organização (opcional)
 * @returns {Promise<Object>} Resultado da postagem
 */
export const createLinkedInPost = async (accessToken, { text, organizationId = null }) => {
  try {
    const author = organizationId 
      ? `urn:li:organization:${organizationId}`
      : 'urn:li:person:' + (await getLinkedInUserInfo(accessToken)).id;

    const postData = {
      author: author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch(`${LINKEDIN_API_URL}/ugcPosts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar post no LinkedIn');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating LinkedIn post:', error);
    throw error;
  }
};
