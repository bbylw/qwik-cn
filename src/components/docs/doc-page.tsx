import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import {
  ALL_DOCS,
  docReadingTime,
  getDoc,
  getDocIndex,
  getDocNeighbors,
  getDocUrl,
} from "../../data/docs";
import { DOC_SECTIONS, headingId } from "../../data/docs/types";
import { renderBlocks } from "./doc-blocks";
import { DocToc, type TocItem } from "./doc-toc";

function plainHeading(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export const DocArticle = component$((props: { slug: string }) => {
  const doc = getDoc(props.slug);

  if (!doc) {
    return (
      <div class="doc-missing">
        <p class="label">404 / DOCUMENT</p>
        <h1>这一页还没有写。</h1>
        <Link href="/docs/">返回文档总览</Link>
      </div>
    );
  }

  const section = DOC_SECTIONS.find((item) => item.id === doc.section);
  const { previous, next } = getDocNeighbors(doc.slug);
  const tocItems: TocItem[] = doc.blocks
    .map((block, index) =>
      block.type === "h2"
        ? { id: headingId(index), text: plainHeading(block.text) }
        : null
    )
    .filter((item): item is TocItem => item !== null);

  return (
    <div class="doc-page" id="top">
      <article class="doc-article">
        <header class="doc-head">
          <nav class="doc-breadcrumb mono" aria-label="面包屑">
            <Link href="/docs/">文档</Link>
            <span aria-hidden="true">/</span>
            <span>{section?.title}</span>
            <span aria-hidden="true">/</span>
            <span class="doc-breadcrumb-current">{doc.title}</span>
          </nav>

          <div class="doc-head-index mono" aria-hidden="true">
            {section?.en} — {String(getDocIndex(doc.slug)).padStart(2, "0")}
          </div>

          <h1 class="doc-title">{doc.title}</h1>
          <p class="doc-description">{doc.description}</p>

          <div class="doc-meta mono">
            <span>约 {docReadingTime(doc)} 分钟</span>
            <span class="doc-meta-sep" aria-hidden="true"></span>
            <span>Qwik v2</span>
            <span class="doc-meta-sep" aria-hidden="true"></span>
            <span>
              {String(getDocIndex(doc.slug)).padStart(2, "0")} /{" "}
              {String(ALL_DOCS.length).padStart(2, "0")}
            </span>
          </div>

          {tocItems.length > 1 ? (
            <details class="doc-toc-mobile">
              <summary>
                <span>本页目录</span>
                <span class="mono">{tocItems.length} 节</span>
              </summary>
              <ol>
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
        </header>

        <div class="doc-body">{renderBlocks(doc.blocks)}</div>

        <footer class="doc-pager">
          {previous ? (
            <Link class="doc-pager-link" href={getDocUrl(previous)}>
              <span class="doc-pager-label mono">上一篇</span>
              <span class="doc-pager-title">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              class="doc-pager-link doc-pager-next"
              href={getDocUrl(next)}
            >
              <span class="doc-pager-label mono">下一篇</span>
              <span class="doc-pager-title">{next.title}</span>
            </Link>
          ) : (
            <Link class="doc-pager-link doc-pager-next" href="/docs/">
              <span class="doc-pager-label mono">回到总览</span>
              <span class="doc-pager-title">文档目录</span>
            </Link>
          )}
        </footer>
      </article>

      <aside class="doc-aside">
        <DocToc items={tocItems} />
      </aside>
    </div>
  );
});
