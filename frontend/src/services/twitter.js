// Substitua com suas credenciais do Twitter
const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = import.meta.env.VITE_TWITTER_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5173/auth/twitter/callback';

// URLs do Twitter
const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const TWITTER_API_URL = 'https://api.twitter.com/2';

// Gera um estado aleatório para segurança
const generateState = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Gera um code verifier e challenge para PKCE
const generateCodeVerifier = () => {
  const array = new Uint32Array(56);
  crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(hash);
};

const base64URLEncode = (str) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const initTwitterAuth = async () => {
  // Gera e salva code verifier
  const codeVerifier = generateCodeVerifier();
  localStorage.setItem('twitter_code_verifier', codeVerifier);
  
  // Gera code challenge
  const codeChallenge = await sha256(codeVerifier);
  
  // Gera e salva state
  const state = generateState();
  localStorage.setItem('twitter_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  return `${TWITTER_AUTH_URL}?${params.toString()}`;
};

export const getTwitterToken = async (code) => {
  const codeVerifier = localStorage.getItem('twitter_code_verifier');
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
    client_id: TWITTER_CLIENT_ID
  });

  try {
    const response = await fetch(TWITTER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    if (!response.ok) {
      throw new Error('Falha ao obter token do Twitter');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting Twitter token:', error);
    throw error;
  }
};

export const getTwitterUserInfo = async (accessToken) => {
  try {
    const response = await fetch(`${TWITTER_API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao obter informações do usuário do Twitter');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting Twitter user info:', error);
    throw error;
  }
};

export const createTweet = async (accessToken, text) => {
  try {
    const response = await fetch(`${TWITTER_API_URL}/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Falha ao criar tweet');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating tweet:', error);
    throw error;
  }
};
