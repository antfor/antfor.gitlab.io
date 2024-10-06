/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_REF_FILE: boolean | undefined;
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }