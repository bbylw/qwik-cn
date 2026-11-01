import { component$, type QRL } from "@qwik.dev/core";
import { Link, useLocation } from "@qwik.dev/router";
import { DOC_GROUPS, getDocUrl } from "../../data/docs";

export const DocsSidebar = component$((props: { onClose$?: QRL<() => void> }) => {
  const loc = useLocation();
  const currentSlug = loc.url.pathname
    .replace(/^\/docs\/?/, "")
    .replace(/\/$/, "");

  return (
    <div class="docs-sidebar">
      <div class="docs-sidebar-head">
        <Link href="/docs/" class="docs-sidebar-title">
          <span class="mono docs-sidebar-mark">QWIK / DOCS</span>
          <span>文档</span>
        </Link>
        <div class="docs-sidebar-head-actions">
          <span class="mono docs-sidebar-version">v2.0</span>
          {props.onClose$ ? (
            <button
              type="button"
              class="docs-drawer-close"
              aria-label="关闭文档目录"
              onClick$={props.onClose$}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          ) : null}
        </div>
      </div>

      <nav class="docs-nav" aria-label="文档目录">
        {DOC_GROUPS.map((group, groupIndex) => (
          <section class="docs-nav-group" key={group.id}>
            <div class="docs-nav-group-head">
              <span class="mono docs-nav-index">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
              <span class="docs-nav-group-title">{group.title}</span>
              <span class="mono docs-nav-en">{group.en}</span>
            </div>
            <ul>
              {group.docs.map((doc) => {
                const active = currentSlug === doc.slug;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={getDocUrl(doc)}
                      class="docs-nav-link"
                      aria-current={active ? "page" : undefined}
                    >
                      <span class="docs-nav-dot" aria-hidden="true"></span>
                      <span>{doc.navTitle ?? doc.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <div class="docs-sidebar-foot">
        <a
          href="https://next.qwik.dev/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          官方英文文档
        </a>
        <a
          href="https://github.com/QwikDev/qwik"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 仓库
        </a>
      </div>
    </div>
  );
});
