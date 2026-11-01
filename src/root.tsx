import { component$ } from "@qwik.dev/core";
import {
  DocumentHeadTags,
  RouterOutlet,
  useLocation,
  useQwikRouter,
} from "@qwik.dev/router";

import "@fontsource-variable/noto-serif-sc";
import "@fontsource-variable/jetbrains-mono";
import "./global.css";

/** 生产域名，构建时由 vite.config.ts 的 `define` 注入；未配置时回退到请求的 origin。 */
const SITE_URL = __SITE_URL__;

const themeScript = `(function(){try{var t=localStorage.getItem('qwik-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default component$(() => {
  useQwikRouter();
  const { url } = useLocation();
  const canonical = `${SITE_URL || url.origin}${url.pathname}`;

  return (
    <>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          content="#f2ede2"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#14130f"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />

        <script dangerouslySetInnerHTML={themeScript} />

        <DocumentHeadTags />

        <link rel="canonical" href={canonical} />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </>
  );
});
