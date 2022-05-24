export const APP_NAME = 'Notes App';

export const JWT_SECRET = process.env.JWT_SECRET || '';

export const IRON_SESSION_CONFIG = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_COOKIE_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
