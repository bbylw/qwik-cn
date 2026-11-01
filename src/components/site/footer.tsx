import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { Brand, QwikMark } from "../brand/brand";

export const SiteFooter = component$(() => {
  return (
    <footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand">
          <Brand footer />
          <p class="footer-tagline">
            Qwik 在 HTML 里保存状态，在浏览器里从断点继续。
          </p>
          <p class="footer-mono mono">
            SERVER / BROWSER · NO HYDRATION
          </p>
        </div>

        <div class="footer-cols">
          <div class="footer-col">
            <p class="footer-col-title mono">站点</p>
            <Link href="/">首页</Link>
            <Link href="/docs/">文档总览</Link>
            <Link href="/docs/getting-started/">快速开始</Link>
            <Link href="/docs/project-structure/">项目结构</Link>
          </div>
          <div class="footer-col">
            <p class="footer-col-title mono">深入</p>
            <Link href="/docs/concepts/think-qwik/">心智模型</Link>
            <Link href="/docs/concepts/resumable/">可恢复性</Link>
            <Link href="/docs/routing/">路由与数据</Link>
            <Link href="/docs/best-practices/">最佳实践</Link>
          </div>
          <div class="footer-col">
            <p class="footer-col-title mono">官方资源</p>
            <a href="https://next.qwik.dev/docs/" target="_blank" rel="noopener noreferrer">
              Qwik 文档
            </a>
            <a href="https://github.com/QwikDev/qwik" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://qwik.dev/chat" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href="https://twitter.com/QwikDev" target="_blank" rel="noopener noreferrer">
              X / @QwikDev
            </a>
          </div>
        </div>
      </div>

      <div class="container footer-base">
        <p class="mono">© 2026 Qwik</p>
        <p class="mono footer-built">由 Qwik v2 构建 · Resumable by default</p>
      </div>

      <div class="footer-watermark" aria-hidden="true">
        <QwikMark />
      </div>
    </footer>
  );
});
