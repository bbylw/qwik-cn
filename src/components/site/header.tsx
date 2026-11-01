import { component$, useSignal, useTask$ } from "@qwik.dev/core";
import { Link, useLocation } from "@qwik.dev/router";
import { Brand } from "../brand/brand";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  {
    href: "/docs/",
    label: "文档",
    isActive: (path: string) =>
      path === "/docs" ||
      path === "/docs/" ||
      path.startsWith("/docs/getting-started") ||
      path.startsWith("/docs/project-structure"),
  },
  {
    href: "/docs/concepts/think-qwik/",
    label: "概念",
    isActive: (path: string) => path.startsWith("/docs/concepts"),
  },
  {
    href: "/docs/core/state/",
    label: "核心",
    isActive: (path: string) => path.startsWith("/docs/core"),
  },
  {
    href: "/docs/routing/",
    label: "路由",
    isActive: (path: string) =>
      path.startsWith("/docs/routing") ||
      path.startsWith("/docs/route-loader") ||
      path.startsWith("/docs/action") ||
      path.startsWith("/docs/server"),
  },
  {
    href: "/docs/best-practices/",
    label: "进阶",
    isActive: (path: string) =>
      path.startsWith("/docs/best-practices") ||
      path.startsWith("/docs/qrl") ||
      path.startsWith("/docs/prefetching") ||
      path.startsWith("/docs/glossary") ||
      path.startsWith("/docs/faq"),
  },
];

export const SiteHeader = component$(() => {
  const loc = useLocation();
  const menuOpen = useSignal(false);

  useTask$(({ track }) => {
    track(() => loc.url.pathname);
    menuOpen.value = false;
  });

  const path = loc.url.pathname;

  return (
    <header class="site-header">
      <div class="container header-inner">
        <Brand />

        <nav class="site-nav" aria-label="主导航">
          {NAV.map((item) => {
            const active = item.isActive(path);
            return (
              <Link
                key={item.href}
                href={item.href}
                class={`nav-link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div class="header-actions">
          <ThemeToggle />
          <a
            class="icon-btn header-github"
            href="https://github.com/QwikDev/qwik"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="在 GitHub 上查看 Qwik"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32-.5-1.3-1.24-1.64-1.24-1.64-1.02-.7.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.72 2.63 1.22 3.27.93.1-.72.4-1.22.72-1.5-2.5-.28-5.12-1.25-5.12-5.55 0-1.23.44-2.23 1.15-3.02-.12-.28-.5-1.43.1-2.97 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.6 1.54.22 2.69.1 2.97.72.79 1.15 1.79 1.15 3.02 0 4.31-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
            </svg>
          </a>
          <Link class="btn btn-sm header-cta" href="/docs/getting-started/">
            开始使用
          </Link>
          <button
            type="button"
            class="menu-toggle"
            aria-label={menuOpen.value ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen.value}
            aria-controls="mobile-nav"
            data-open={menuOpen.value ? "true" : "false"}
            onClick$={() => {
              menuOpen.value = !menuOpen.value;
            }}
          >
            <span class="menu-bar menu-bar-a" aria-hidden="true"></span>
            <span class="menu-bar menu-bar-b" aria-hidden="true"></span>
            <span class="menu-bar menu-bar-c" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        class="mobile-nav"
        data-open={menuOpen.value ? "true" : "false"}
        aria-hidden={!menuOpen.value}
      >
        <div class="container mobile-nav-inner">
          <nav aria-label="移动端主导航">
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                class="mobile-nav-link"
                onClick$={() => {
                  menuOpen.value = false;
                }}
              >
                <span class="mobile-nav-index mono">
                  0{index + 1}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div class="mobile-nav-extra">
            <Link
              href="/docs/getting-started/"
              class="btn"
              onClick$={() => {
                menuOpen.value = false;
              }}
            >
              创建第一个应用
            </Link>
            <a
              href="https://github.com/QwikDev/qwik"
              target="_blank"
              rel="noopener noreferrer"
              class="mono mobile-github"
            >
              GitHub / QwikDev/qwik
            </a>
          </div>
        </div>
      </div>
    </header>
  );
});
