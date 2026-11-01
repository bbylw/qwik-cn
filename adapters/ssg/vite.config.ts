import { ssgAdapter } from "@qwik.dev/router/adapters/ssg/vite";
import { extendConfig } from "@qwik.dev/router/vite";
import { loadEnv } from "vite";
import baseConfig from "../../vite.config.ts";

/**
 * SSG 构建配置。由 `bun run build.server` 触发，排在主 client 构建之后，
 * 把每条路由预渲染成静态 HTML 写入 dist，同时产出 sitemap.xml。
 */
export default extendConfig(baseConfig, (env) => {
  const origin = (loadEnv(env.mode, process.cwd()).VITE_SITE_URL ?? "").replace(
    /\/$/,
    "",
  );

  return {
    build: {
      ssr: true,
      rolldownOptions: {
        input: ["@qwik-router-config"],
      },
    },
    plugins: [
      ssgAdapter({
        // 未配置域名时退回本地 origin，并跳过 sitemap（绝对地址不可信）
        origin: origin || "http://localhost:4173",
        sitemapOutFile: origin ? "sitemap.xml" : null,
      }),
    ],
  };
});
