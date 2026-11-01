import { component$, useSignal } from "@qwik.dev/core";
import { headingId, type DocBlock } from "../../data/docs/types";
import { CodeBlock } from "./code-block";
import { renderInline } from "./inline";

const CALL_OUT_LABEL = {
  note: "NOTE",
  warn: "WARN",
  tip: "TIP",
} as const;

const DemoCounter = component$(() => {
  const count = useSignal(0);

  return (
    <div class="doc-demo">
      <div class="doc-demo-head">
        <span class="mono">LIVE / USE_SIGNAL</span>
        <span class="mono doc-demo-state">
          {count.value === 0 ? "idle" : "updated"}
        </span>
      </div>
      <div class="doc-demo-main">
        <output class="doc-demo-value" aria-live="polite">
          {String(count.value).padStart(2, "0")}
        </output>
        <div class="doc-demo-copy">
          <p>这个数字由 signal 驱动。点击任意按钮，只有这块 DOM 更新。</p>
          <div class="doc-demo-actions">
            <button
              type="button"
              class="doc-demo-btn"
              onClick$={() => count.value++}
            >
              +1
            </button>
            <button
              type="button"
              class="doc-demo-btn doc-demo-btn-ghost"
              onClick$={() => count.value--}
            >
              -1
            </button>
            <button
              type="button"
              class="doc-demo-reset mono"
              onClick$={() => {
                count.value = 0;
              }}
            >
              归零
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export function renderBlocks(blocks: DocBlock[]) {
  let headingCount = 0;

  return blocks.map((block, index) => {
    switch (block.type) {
      case "p":
        return (
          <p key={index} class="doc-p">
            {renderInline(block.text)}
          </p>
        );
      case "h2": {
        headingCount += 1;
        const id = headingId(index);
        return (
          <h2 key={index} id={id} class="doc-h2" tabIndex={-1}>
            <span class="doc-heading-num mono">
              {String(headingCount).padStart(2, "0")}
            </span>
            <span class="doc-heading-text">{renderInline(block.text)}</span>
            <a class="doc-anchor" href={`#${id}`} aria-label="链接到本节">
              #
            </a>
          </h2>
        );
      }
      case "h3":
        return (
          <h3 key={index} class="doc-h3">
            {renderInline(block.text)}
          </h3>
        );
      case "list":
        return block.ordered ? (
          <ol key={index} class="doc-list doc-list-ordered">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ))}
          </ol>
        ) : (
          <ul key={index} class="doc-list">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      case "code":
        return (
          <div key={index} class="doc-code">
            <CodeBlock
              code={block.code}
              lang={block.lang}
              title={block.title}
            />
          </div>
        );
      case "callout":
        return (
          <aside key={index} class="doc-callout" data-tone={block.tone}>
            <div class="doc-callout-rail">
              <span class="doc-callout-mark mono">
                {CALL_OUT_LABEL[block.tone]}
              </span>
            </div>
            <div class="doc-callout-body">
              <p class="doc-callout-title">{block.title}</p>
              <p class="doc-callout-text">{renderInline(block.text)}</p>
            </div>
          </aside>
        );
      case "table":
        return (
          <div key={index} class="doc-table-wrap">
            <table class="doc-table">
              <thead>
                <tr>
                  {block.head.map((cell, cellIndex) => (
                    <th key={cellIndex} scope="col">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "steps":
        return (
          <ol key={index} class="doc-steps">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <span class="doc-step-num mono">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <div>
                  <p class="doc-step-title">{item.title}</p>
                  <p class="doc-step-text">{renderInline(item.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        );
      case "quote":
        return (
          <figure key={index} class="doc-quote">
            <blockquote>{renderInline(block.text)}</blockquote>
            {block.cite ? (
              <figcaption class="mono">— {block.cite}</figcaption>
            ) : null}
          </figure>
        );
      case "demo":
        return <DemoCounter key={index} />;
      case "divider":
        return <hr key={index} class="doc-divider" />;
      default:
        return null;
    }
  });
}
