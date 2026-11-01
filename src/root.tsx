import { component$ } from "@qwik.dev/core";
import {
  DocumentHeadTags,
  RouterOutlet,
  useLocation,
  useQwikRouter,
} from "@qwik.dev/router";

import "@fontsource-variable/noto-serif-sc";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/jetbrains-mono";
import "./global.css";

const themeScript = `(function(){try{var t=localStorage.getItem('qwik-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default component$(() => {
  useQwikRouter();
  const { url } = useLocation();

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

        <link rel="canonical" href={url.href} />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </>
  );
});
