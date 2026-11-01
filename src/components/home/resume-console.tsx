import { component$, useSignal } from "@qwik.dev/core";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CHUNKS = [
  { name: "chunk/resume.js", size: "0.9 kB", detail: "状态恢复" },
  { name: "chunk/on-click.js", size: "0.3 kB", detail: "事件处理" },
];

export const ResumeConsole = component$(() => {
  const phase = useSignal<"paused" | "resuming" | "live">("paused");
  const loaded = useSignal(0);
  const count = useSignal(0);

  const statusText =
    phase.value === "paused"
      ? "服务端已暂停"
      : phase.value === "resuming"
        ? "正在续接"
        : "浏览器已续接";

  return (
    <div class="console fade-up" data-phase={phase.value}>
      <div class="console-head">
        <div class="console-title">
          <span class="console-id mono">RESUME_CONSOLE / 001</span>
          <span class="console-rule" aria-hidden="true"></span>
        </div>
        <span class="console-status" data-phase={phase.value}>
          <i class="console-led" aria-hidden="true"></i>
          {statusText}
        </span>
      </div>

      <div class="console-stage">
        <div class="console-stage-head">
          <span class="mono">01 / SERVER</span>
          <span class="mono console-stage-state">PAUSED</span>
        </div>
        <div class="serial-list">
          <div class="serial-row">
            <span class="serial-key">component</span>
            <code class="serial-val">Counter#c_01</code>
            <span class="serial-ok mono">已序列化</span>
          </div>
          <div class="serial-row">
            <span class="serial-key">listener</span>
            <code class="serial-val">on:click → s_LToOr</code>
            <span class="serial-ok mono">已序列化</span>
          </div>
          <div class="serial-row">
            <span class="serial-key">state</span>
            <code class="serial-val">{"{ count: 0 }"}</code>
            <span class="serial-ok mono">已序列化</span>
          </div>
        </div>
        <p class="console-note mono">
          没有 re-render，没有事件重绑，只有一份可读的 HTML。
        </p>
      </div>

      <div class="handoff" aria-hidden="true">
        <span class="handoff-line"></span>
        <span class="handoff-label mono">HTML + q:state</span>
        <span class="handoff-line"></span>
      </div>

      <div class="console-stage console-stage-client">
        <div class="console-stage-head">
          <span class="mono">02 / BROWSER</span>
          <span
            class="mono console-stage-state"
            data-live={phase.value === "live" ? "true" : "false"}
          >
            {phase.value === "live" ? "RESUMED" : "WAITING"}
          </span>
        </div>

        <div class="counter">
          <div class="counter-meta">
            <span class="mono counter-label">COUNTER / SIGNAL</span>
            <span class="mono counter-mode">
              {phase.value === "live" ? "interactive" : "html only"}
            </span>
          </div>
          <output class="counter-value" aria-live="polite">
            {String(count.value).padStart(2, "0")}
          </output>
          <button
            type="button"
            class="resume-btn"
            disabled={phase.value === "resuming"}
            onClick$={async () => {
              if (phase.value === "resuming") return;
              if (phase.value === "live") {
                count.value += 1;
                return;
              }
              phase.value = "resuming";
              for (let index = 0; index < CHUNKS.length; index++) {
                await wait(index === 0 ? 420 : 330);
                loaded.value = index + 1;
              }
              phase.value = "live";
            }}
          >
            {phase.value === "paused"
              ? "续接应用"
              : phase.value === "resuming"
                ? "加载符号中"
                : "点击计数 +1"}
          </button>
        </div>

        <div class="chunk-list">
          <div class="chunk-row" data-loaded="true">
            <span class="chunk-dot" aria-hidden="true"></span>
            <code>serialized-html</code>
            <span class="chunk-size mono">SSR</span>
            <span class="chunk-state mono">已送达</span>
          </div>
          {CHUNKS.map((chunk, index) => {
            const isLoaded = loaded.value > index;
            return (
              <div
                class="chunk-row"
                data-loaded={isLoaded ? "true" : "false"}
                key={chunk.name}
              >
                <span class="chunk-dot" aria-hidden="true"></span>
                <code>{chunk.name}</code>
                <span class="chunk-size mono">{chunk.size}</span>
                <span class="chunk-state mono">
                  {isLoaded
                    ? "已加载"
                    : phase.value === "resuming" && loaded.value === index
                      ? "加载中"
                      : "待请求"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div class="console-foot">
        <span class="mono">0 次重渲</span>
        <span class="mono">{loaded.value}/2 chunk</span>
        <span class="mono">count = {count.value}</span>
      </div>
    </div>
  );
});
