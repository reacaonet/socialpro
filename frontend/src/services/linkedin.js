// Substitua com suas credenciais do LinkedIn
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'https://socialpro-wine.vercel.app/auth/linkedin/callback';

// URLs do LinkedIn
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

// Gera um estado aleatório para segurança
const generateState = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const initLinkedInAuth = () => {
  const state = generateState();
  localStorage.setItem('linkedin_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: 'r_liteprofile r_emailaddress w_member_social r_organization_social w_organization_social rw_organization_admin'
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

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

export const getLinkedInUserInfo = async (accessToken) => {
  try {
    // Obtém informações básicas do perfil
    const profileResponse = await fetch(`${LINKEDIN_API_URL}/me`, {
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

    // Obtém foto do perfil
    const profilePictureResponse = await fetch(`${LINKEDIN_API_URL}/me?projection=(profilePicture(displayImage~:playableStreams))`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok || !emailResponse.ok || !profilePictureResponse.ok) {
      throw new Error('Falha ao obter informações do usuário do LinkedIn');
    }

    const profileData = await profileResponse.json();
    const emailData = await emailResponse.json();
    const pictureData = await profilePictureResponse.json();

    // Pega a URL da maior imagem disponível
    let profilePictureUrl = null;
    if (pictureData.profilePicture?.['displayImage~']?.elements) {
      const images = pictureData.profilePicture['displayImage~'].elements;
      const largestImage = images[images.length - 1];
      profilePictureUrl = largestImage?.identifiers[0]?.identifier;
    }

    return {
      id: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: emailData.elements[0]['handle~'].emailAddress,
      profilePicture: profilePictureUrl
    };
  } catch (error) {
    console.error('Error getting LinkedIn user info:', error);
    throw error;
  }
};

export const getLinkedInCompanyPages = async (accessToken) => {
  try {
    const response = await fetch(`${LINKEDIN_API_URL}/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao obter páginas do LinkedIn');
    }

    const data = await response.json();
    
    // Obtém detalhes de cada organização
    const organizations = await Promise.all(
      data.elements.map(async (element) => {
        const orgId = element.organizationalTarget.split(':')[3];
        const orgResponse = await fetch(`${LINKEDIN_API_URL}/organizations/${orgId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!orgResponse.ok) return null;
        
        const orgData = await orgResponse.json();
        return {
          id: orgId,
          name: orgData.localizedName,
          vanityName: orgData.vanityName,
          logoUrl: orgData.logoV2?.['original~']?.elements[0]?.identifiers[0]?.identifier
        };
      })
    );

    return organizations.filter(org => org !== null);
  } catch (error) {
    console.error('Error getting LinkedIn company pages:', error);
    throw error;
  }
};

export const createLinkedInPost = async (accessToken, { text, organizationId = null }) => {
  try {
    const author = organizationId 
      ? `urn:li:organization:${organizationId}`
      : `urn:li:person:${(await getLinkedInUserInfo(accessToken)).id}`;

    const postData = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating LinkedIn post:', error);
    throw error;
  }
};
