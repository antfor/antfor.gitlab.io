

const VITE_REF_FILE = import.meta.env.VITE_REF_FILE as boolean || false;

export const PAGES = {
  HOME: (VITE_REF_FILE ? "/index.html" : "/"),
  CV: (VITE_REF_FILE ?  "/cv.html" : "/cv" ),
  STORE: 'https://play.google.com/store/apps/developer?id=Anton+Forsberg',
  GITHUB: 'https://Github.com/antfor',
} as const;

export type page = typeof PAGES[keyof typeof PAGES];
 