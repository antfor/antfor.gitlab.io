

const VITE_REF_FILE = import.meta.env.VITE_REF_FILE as boolean || false;
const BASE_URL = import.meta.env.BASE_URL;

export const PAGES = {
  HOME: BASE_URL + (VITE_REF_FILE ? "index.html" : ""),
  CV: BASE_URL + (VITE_REF_FILE ? "cv.html" : "cv"),
  STORE: 'https://play.google.com/store/apps/developer?id=Anton+Forsberg',
  GITHUB: 'https://Github.com/antfor',
} as const;

export type page = typeof PAGES[keyof typeof PAGES];


const PROJECT_URL = BASE_URL + "projects/";

export const PROJECTS = {
  Interest: PROJECT_URL + "interest#calculator",
  FRACTAL: PROJECT_URL + "l-system",
  ORM: PROJECT_URL + "orm",
} as const 