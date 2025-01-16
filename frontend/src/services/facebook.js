// Substitua com seu App ID do Facebook
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

export const initFacebookSDK = () => {
  return new Promise((resolve) => {
    // Carrega o SDK do Facebook assincronamente
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      
      resolve();
    };

    // Carrega o SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/pt_BR/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

export const loginWithFacebook = () => {
  return new Promise((resolve, reject) => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        // Usuário autorizou o aplicativo
        const accessToken = response.authResponse.accessToken;
        const userID = response.authResponse.userID;
        
        // Obtém informações básicas do usuário
        window.FB.api('/me', { fields: 'name,email' }, function(userInfo) {
          resolve({
            accessToken,
            userID,
            userInfo
          });
        });
      } else {
        reject('Usuário cancelou o login ou não autorizou totalmente.');
      }
    }, {
      scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts'
    });
  });
};

export const getConnectedPages = () => {
  return new Promise((resolve, reject) => {
    window.FB.api('/me/accounts', function(response) {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export const createFacebookPost = (pageId, message) => {
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${pageId}/feed`,
      'POST',
      { message },
      function(response) {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      }
    );
  });
};
