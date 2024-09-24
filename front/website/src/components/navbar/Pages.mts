

export const PAGES = {
  HOME: '/',
  CV: '/cv',
  STORE: 'https://play.google.com/store/apps/developer?id=Anton+Forsberg',
  GITHUB: 'https://Github.com/antfor',
} as const;

export type page = typeof PAGES[keyof typeof PAGES];
 