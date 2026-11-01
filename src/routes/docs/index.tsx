import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { Link } from "@qwik.dev/router";
import {
  ALL_DOCS,
  DOC_GROUPS,
  docReadingTime,
  getDocIndex,
  getDocUrl,
} from "../../data/docs";

export default component$(() => {
  return (
    <div class="docs-index">
      <header class="docs-index-hero">
        <p class="label">DOCUMENTATION / QWIK V2</p>
        <h1 class="docs-index-title">
          从 HTML 开始，
          <br />
          <span>理解可恢复的 Web。</span>
        </h1>
        <p class="docs-index-lede">
          {ALL_DOCS.length} 篇文档，从第一次创建项目到 QRL、路由与性能实践。每一页都可以直接运行，每一段代码都对应 Qwik v2 的真实 API。
        </p>
        <div class="docs-index-meta mono">
          <span>{ALL_DOCS.length} 篇</span>
          <span class="doc-meta-sep" aria-hidden="true"></span>
          <span>5 个章节</span>
          <span class="doc-meta-sep" aria-hidden="true"></span>
          <span>按 Ctrl K 搜索</span>
        </div>
        <div class="docs-index-actions">
          <Link class="btn" href="/docs/getting-started/">
            从快速开始读起
          </Link>
          <Link class="btn btn-ghost" href="/docs/concepts/think-qwik/">
            先看心智模型
          </Link>
        </div>
      </header>

      <div class="docs-index-main">
        {DOC_GROUPS.map((group, groupIndex) => (
          <section class="docs-index-group" key={group.id}>
            <header class="docs-index-group-head">
              <span class="docs-index-group-num mono">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <p class="mono docs-index-group-en">{group.en}</p>
                <h2>{group.title}</h2>
              </div>
              <span class="mono docs-index-group-count">
                {String(group.docs.length).padStart(2, "0")}
              </span>
            </header>

            <ol class="docs-index-list">
              {group.docs.map((doc, docIndex) => (
                <li key={doc.slug}>
                  <Link href={getDocUrl(doc)} class="docs-index-item">
                    <span class="docs-index-item-num mono">
                      {String(docIndex + 1).padStart(2, "0")}
                    </span>
                    <span class="docs-index-item-body">
                      <span class="docs-index-item-title">
                        {doc.navTitle ?? doc.title}
                      </span>
                      <span class="docs-index-item-desc">
                        {doc.description}
                      </span>
                    </span>
                    <span class="docs-index-item-meta mono">
                      约 {docReadingTime(doc)} 分钟
                      <span class="docs-index-item-index">
                        {String(getDocIndex(doc.slug)).padStart(2, "0")}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <aside class="docs-index-aside">
        <div class="reading-path">
          <p class="label">建议路径</p>
          <p class="reading-path-title">第一次接触 Qwik？按这个顺序读。</p>
          <ol class="reading-path-list">
            <li>
              <Link href="/docs/getting-started/">
                <span class="mono">01</span>
                <strong>快速开始</strong>
                <small>创建项目，写第一个 routeLoader$ 与表单。</small>
              </Link>
            </li>
            <li>
              <Link href="/docs/concepts/resumable/">
                <span class="mono">02</span>
                <strong>可恢复性</strong>
                <small>理解为什么 Qwik 不需要水合。</small>
              </Link>
            </li>
            <li>
              <Link href="/docs/core/state/">
                <span class="mono">03</span>
                <strong>状态与事件</strong>
                <small>用 signal 建立细粒度更新。</small>
              </Link>
            </li>
            <li>
              <Link href="/docs/routing/">
                <span class="mono">04</span>
                <strong>路由与数据</strong>
                <small>把页面、loader 与 action 串起来。</small>
              </Link>
            </li>
          </ol>
        </div>

        <div class="docs-index-note">
          <span class="mono">READING NOTE</span>
          <p>
            文档里的代码都可以直接复制到项目里运行。带 <code>$</code> 的示例对应 Optimizer 的切分边界，改动时保持这个约定。
          </p>
        </div>
      </aside>
    </div>
  );
});

export const head: DocumentHead = {
  title: "文档 · Qwik 中文",
  meta: [
    {
      name: "description",
      content:
        "Qwik v2 中文文档：快速开始、可恢复性、状态与事件、文件路由、routeLoader$、routeAction$、server$ 与性能实践。",
    },
  ],
};
