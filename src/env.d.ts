/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
  readonly NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
  readonly PUBLIC_STRIPE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
