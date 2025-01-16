// Substitua com suas credenciais do Instagram
const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = import.meta.env.VITE_INSTAGRAM_APP_SECRET;
const REDIRECT_URI = 'http://localhost:5173/auth/instagram/callback';

// URLs do Instagram
const INSTAGRAM_AUTH_URL = 'https://api.instagram.com/oauth/authorize';
const INSTAGRAM_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';
const INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com';

export const initInstagramAuth = () => {
  const scope = 'user_profile,user_media';
  const authUrl = `${INSTAGRAM_AUTH_URL}?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=code`;
  return authUrl;
};

export const getInstagramToken = async (code) => {
  const formData = new URLSearchParams();
  formData.append('client_id', INSTAGRAM_APP_ID);
  formData.append('client_secret', INSTAGRAM_APP_SECRET);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', REDIRECT_URI);
  formData.append('code', code);

  try {
    const response = await fetch(INSTAGRAM_TOKEN_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao obter token do Instagram');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting Instagram token:', error);
    throw error;
  }
};

export const getInstagramUserInfo = async (accessToken) => {
  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_URL}/me?fields=id,username&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Falha ao obter informações do usuário do Instagram');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting Instagram user info:', error);
    throw error;
  }
};

export const getInstagramMedia = async (accessToken) => {
  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_URL}/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Falha ao obter mídia do Instagram');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting Instagram media:', error);
    throw error;
  }
};
