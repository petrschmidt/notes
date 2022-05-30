import { APP_NAME } from './constants';

export const getMetaTitle = (pageName: string) => `${pageName} • ${APP_NAME}`;

export const isBrowser = typeof window !== undefined;
