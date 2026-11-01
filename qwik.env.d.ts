// This file can be used to add references for global types like `vite/client`.

// Add global `vite/client` types. For more info, see: https://vitejs.dev/guide/features#client-types
/// <reference types="vite/client" />

/** 站点域名，由 vite.config.ts 的 `define` 注入（来源：VITE_SITE_URL 环境变量）。 */
declare const __SITE_URL__: string;
