import { component$, useSignal } from "@qwik.dev/core";
import { CodeBlock } from "../docs/code-block";

const CODE = `import { component$, useSignal, useTask$ } from '@qwik.dev/core';

export const Counter = component$(() => {
  const count = useSignal(0);

  useTask$(({ track }) => {
    track(count);
    console.log('count is', count.value);
  });

  return (
    <button onClick$={() => count.value++}>
      {count.value}
    </button>
  );
});`;

const CHUNKS = [
  {
    file: "Counter_component.js",
    label: "渲染函数",
    size: "0.7 kB",
    note: "只在需要重新渲染时加载",
  },
  {
    file: "Counter_useTask.js",
    label: "响应任务",
    size: "0.3 kB",
    note: "count 变化时才请求",
  },
  {
    file: "Counter_onClick.js",
    label: "事件处理",
    size: "0.2 kB",
    note: "首次点击才进入 VM",
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const OptimizerDemo = component$(() => {
  const split = useSignal(0);
  const running = useSignal(false);

  return (
    <div class="opt-demo">
      <div class="opt-code">
        <CodeBlock code={CODE} title="src/components/counter.tsx" />
      </div>
      <div class="opt-side">
        <div class="opt-side-head">
          <span class="mono">OPTIMIZER OUTPUT</span>
          <span class="mono opt-count">
            {split.value > 0 ? `${split.value} symbols` : "waiting"}
          </span>
        </div>
        <div class="opt-chunks">
          {CHUNKS.map((chunk, index) => {
            const isOut = split.value > index;
            return (
              <div
                class="opt-chunk"
                data-out={isOut ? "true" : "false"}
                key={chunk.file}
              >
                <div class="opt-chunk-top">
                  <span class="opt-chunk-index mono">0{index + 1}</span>
                  <code class="opt-file">{chunk.file}</code>
                  <span class="opt-size mono">{isOut ? chunk.size : "—"}</span>
                </div>
                <p class="opt-label">{chunk.label}</p>
                <p class="opt-note mono">{isOut ? chunk.note : "等待拆分"}</p>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          class="btn opt-btn"
          disabled={running.value}
          onClick$={async () => {
            if (running.value) return;
            if (split.value === CHUNKS.length) {
              split.value = 0;
              return;
            }
            running.value = true;
            split.value = 0;
            for (let index = 0; index < CHUNKS.length; index++) {
              await wait(index === 0 ? 260 : 360);
              split.value = index + 1;
            }
            running.value = false;
          }}
        >
          {split.value === CHUNKS.length ? "重置演示" : "运行 Optimizer"}
        </button>
        <p class="opt-caption">
          每个 <code>$</code> 都是一个可独立请求的符号。Qwik 不会为了一个点击事件加载整棵组件树。
        </p>
      </div>
    </div>
  );
});
