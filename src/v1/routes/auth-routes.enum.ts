export const AuthRoutePath = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  REFRESH: '/auth/refresh', // api backend route
  SOCIAL_AUTH_URL: undefined, // '/auth/:provider/url',
  CALLBACK_GOOGLE: undefined, // '/auth/google/callback',
} as const;
