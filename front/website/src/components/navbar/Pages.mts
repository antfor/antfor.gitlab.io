

const PUBLIC_URL = import.meta.env['BASE_URL'] || '/';
const PRODUCTION = PUBLIC_URL === '/';

export const PAGES = {
  HOME: PUBLIC_URL  + (PRODUCTION ? "": "index.html"),
  CV: PUBLIC_URL + (PRODUCTION ? "cv" :  "cv.html"),
  STORE: 'https://play.google.com/store/apps/developer?id=Anton+Forsberg',
  GITHUB: 'https://Github.com/antfor',
} as const;

export type page = typeof PAGES[keyof typeof PAGES];
 