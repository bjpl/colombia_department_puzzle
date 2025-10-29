/// <reference types="vite/client" />

// Build-time injected constants
declare const __BUILD_DATE__: string;

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}