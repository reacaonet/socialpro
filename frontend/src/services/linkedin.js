// Substitua com suas credenciais do LinkedIn
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5173/auth/linkedin/callback';

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
    scope: 'r_liteprofile r_emailaddress w_member_social'
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
      throw new Error('Falha ao obter token do LinkedIn');
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

    if (!profileResponse.ok || !emailResponse.ok) {
      throw new Error('Falha ao obter informações do usuário do LinkedIn');
    }

    const profileData = await profileResponse.json();
    const emailData = await emailResponse.json();

    return {
      ...profileData,
      email: emailData.elements[0]['handle~'].emailAddress
    };
  } catch (error) {
    console.error('Error getting LinkedIn user info:', error);
    throw error;
  }
};

export const createLinkedInPost = async (accessToken, text) => {
  try {
    // Primeiro, obtém a URN do usuário
    const userInfo = await getLinkedInUserInfo(accessToken);
    const authorUrn = `urn:li:person:${userInfo.id}`;

    const postData = {
      author: authorUrn,
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
      throw new Error('Falha ao criar post no LinkedIn');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating LinkedIn post:', error);
    throw error;
  }
};
