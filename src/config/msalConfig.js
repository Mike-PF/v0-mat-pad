export const msalConfig = {
    auth: {
        clientId: '5b694d0c-b973-4142-9cef-9d1646747599',
        authority: 'https://matpad.b2clogin.com/matpad.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN',
        knownAuthorities: ['matpad.b2clogin.com'],
        redirectUri: '/',
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. 'sessionStorage' is more secure, but 'localStorage' gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to 'true' if you are having issues on IE11 or Edge
    }
}

export const b2cPolicies = {
    names: {
        signUpSignIn: 'B2C_1A_SIGNUP_SIGNIN',
        forgotPassword: 'B2C_1A_RESET',
        editProfile: 'B2C_1A_PROFILE',
    },
    authorities: {
        signUpSignIn: {
            authority: 'https://matpad.b2clogin.com/matpad.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN',
        }
    },
    authorityDomain: 'matpad.b2clogin.com',
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ['https://matpad.onmicrosoft.com/2421f27e-623a-4622-8ad7-5ba3926da6c6/system_access'],
};
