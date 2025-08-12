/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly NODE_ENV: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly VITE_COINAPI_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}