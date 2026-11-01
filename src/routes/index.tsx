import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { Link } from "@qwik.dev/router";
import { CopyButton } from "../components/site/copy-button";
import { ResumeConsole } from "../components/home/resume-console";
import { OptimizerDemo } from "../components/home/optimizer-demo";
import { RouterTabs } from "../components/home/router-tabs";
import { ALL_DOCS, DOC_GROUPS, getDocUrl } from "../data/docs";

const MECHANISMS = [
  {
    title: "可恢复性",
    en: "RESUMABILITY",
    text: "状态、监听器与组件边界被序列化进 HTML。浏览器从服务器停下的地方继续，不重新执行组件。",
    href: "/docs/concepts/resumable/",
  },
  {
    title: "细粒度信号",
    en: "SIGNALS",
    text: "读到哪里，就更新哪里。没有依赖数组，没有整棵组件树的重渲染。",
    href: "/docs/core/state/",
  },
  {
    title: "QRL 懒加载",
    en: "QRL",
    text: "每个 $ 都是一个可序列化的代码引用。交互真正发生时，才下载对应符号。",
    href: "/docs/qrl/",
  },
  {
    title: "流式 SSR",
    en: "STREAMING",
    text: "HTML 分块到达，慢数据只影响自己的边界。页面先可用，再逐步补全。",
    href: "/docs/prefetching/",
  },
  {
    title: "文件路由",
    en: "ROUTER",
    text: "页面、loader、action 与端点共用一条 URL 生命周期，服务端与浏览器看到同一份输入。",
    href: "/docs/routing/",
  },
];

const HYDRATION_BLOCKS = Array.from({ length: 16 }, (_, index) => index);
const RESUME_BLOCKS = Array.from({ length: 16 }, (_, index) => index);

export default component$(() => {
  return (
    <div class="home">
      <section class="hero">
        <div class="hero-grid-bg" aria-hidden="true"></div>
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="hero-topline">
              <span class="label">RESUMABLE WEB FRAMEWORK</span>
              <span class="mono hero-version">QWIK / V2.0</span>
            </div>

            <h1 class="hero-title">
              从服务器
              <br />
              <span class="hero-title-accent">继续运行。</span>
            </h1>

            <p class="hero-lede">
              Qwik 把状态和事件监听器写进 HTML。浏览器不需要重新执行整个应用，只加载下一次交互真正需要的代码。零成本打造即时加载的 Web 应用。
            </p>

            <div class="hero-actions">
              <Link class="btn hero-cta" href="/docs/getting-started/">
                开始构建
              </Link>
              <Link
                class="btn btn-ghost"
                href="/docs/concepts/resumable/"
              >
                理解可恢复性
              </Link>
            </div>

            <dl class="hero-facts">
              <div>
                <dt class="mono">HYDRATION</dt>
                <dd>无</dd>
              </div>
              <div>
                <dt class="mono">QWIKLOADER</dt>
                <dd>≈1 KB</dd>
              </div>
              <div>
                <dt class="mono">STARTUP</dt>
                <dd>O(1)</dd>
              </div>
            </dl>
          </div>

          <div class="hero-demo">
            <div class="hero-demo-head mono">
              <span>LIVE / RESUME</span>
              <span class="hero-demo-hint">点击左侧按钮观察</span>
            </div>
            <ResumeConsole />
            <p class="hero-demo-note mono">
              SSR 输出 → 浏览器恢复 → 按需加载符号
            </p>
          </div>
        </div>

        <div class="hero-side-note mono" aria-hidden="true">
          <span>NO HYDRATION</span>
          <span>HTML FIRST</span>
          <span>RESUME ANYWHERE</span>
        </div>
      </section>

      <section class="spec-strip" aria-label="Qwik 关键指标">
        <div class="container spec-grid">
          <div class="spec-item">
            <span class="spec-kicker mono">01 / COMPONENT REPLAY</span>
            <strong class="spec-value">0</strong>
            <span class="spec-note">启动时不重放组件</span>
          </div>
          <div class="spec-item">
            <span class="spec-kicker mono">02 / EAGER JS</span>
            <strong class="spec-value">≈1 KB</strong>
            <span class="spec-note">qwikloader 内联在 HTML</span>
          </div>
          <div class="spec-item">
            <span class="spec-kicker mono">03 / STARTUP SCALE</span>
            <strong class="spec-value">O(1)</strong>
            <span class="spec-note">应用变大，启动成本不变</span>
          </div>
          <div class="spec-item">
            <span class="spec-kicker mono">04 / FIRST PAINT</span>
            <strong class="spec-value">HTML</strong>
            <span class="spec-note">内容先到，交互随后</span>
          </div>
        </div>
      </section>

      <section class="section section-hydration">
        <div class="container section-split">
          <div class="section-side">
            <p class="label">01 / THE COST</p>
            <h2 class="section-title">水合，是一次不必要的重启。</h2>
            <p class="section-lede">
              其他框架服务端渲染后，还要在浏览器里重新执行一遍组件、恢复状态、重新绑定监听器。页面看起来已经好了，主线程却还在忙。
            </p>
            <blockquote class="section-quote">
              “可恢复性不是更快的重新执行，而是根本不需要重新执行。”
            </blockquote>
          </div>

          <div class="section-body">
            <div class="startup-compare">
              <div class="compare-row" data-kind="hydration">
                <div class="compare-head">
                  <span class="compare-title">传统水合</span>
                  <span class="mono compare-tag">HYDRATION</span>
                </div>
                <div class="compare-blocks" aria-hidden="true">
                  {HYDRATION_BLOCKS.map((index) => (
                    <span key={index} class="compare-block is-on"></span>
                  ))}
                </div>
                <p class="compare-caption">
                  启动时执行全部组件与副作用，再把这些工作交给浏览器。
                </p>
              </div>

              <div class="compare-row" data-kind="resume">
                <div class="compare-head">
                  <span class="compare-title">Qwik 恢复</span>
                  <span class="mono compare-tag">RESUME</span>
                </div>
                <div class="compare-blocks" aria-hidden="true">
                  {RESUME_BLOCKS.map((index) => (
                    <span
                      key={index}
                      class={`compare-block ${index === 6 ? "is-on is-focus" : ""}`}
                    ></span>
                  ))}
                </div>
                <p class="compare-caption">
                  读取已序列化的状态，只下载并执行被触发的那个符号。
                </p>
              </div>
            </div>

            <div class="compare-legend mono">
              <span>
                <i class="legend-dot legend-dot-on" aria-hidden="true"></i>
                启动时执行
              </span>
              <span>
                <i class="legend-dot legend-dot-focus" aria-hidden="true"></i>
                首次交互才加载
              </span>
              <span class="compare-note">示意图</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-chart">
        <div class="container section-split section-split-reverse">
          <div class="section-body chart-body">
            <figure class="tti-figure">
              <div class="tti-head mono">
                <span>STARTUP COST / APP SIZE</span>
                <span>示意图</span>
              </div>
              <svg
                class="tti-chart"
                viewBox="0 0 760 420"
                role="img"
                aria-label="示意曲线：传统水合框架的启动成本随应用规模上升，Qwik 保持近乎恒定。"
              >
                <g class="chart-grid">
                  <line x1="72" y1="330" x2="720" y2="330" />
                  <line x1="72" y1="258" x2="720" y2="258" />
                  <line x1="72" y1="186" x2="720" y2="186" />
                  <line x1="72" y1="114" x2="720" y2="114" />
                  <line x1="72" y1="42" x2="720" y2="42" />
                  <line x1="72" y1="42" x2="72" y2="330" />
                </g>
                <g class="chart-axis mono">
                  <text x="720" y="356" text-anchor="end">应用规模 →</text>
                  <text x="72" y="24">启动成本 ↑</text>
                  <text x="86" y="354">小</text>
                  <text x="706" y="354" text-anchor="end">大</text>
                </g>
                <path
                  class="chart-line chart-line-hydration"
                  pathLength="1"
                  d="M72 322 C 240 314, 420 244, 720 54"
                />
                <path
                  class="chart-line chart-line-qwik"
                  pathLength="1"
                  d="M72 306 L720 306"
                />
                <g class="chart-labels mono">
                  <text x="640" y="44">水合框架</text>
                  <text x="640" y="292">Qwik</text>
                </g>
                <line
                  class="chart-marker"
                  x1="292"
                  y1="300"
                  x2="292"
                  y2="330"
                />
                <text class="chart-marker-label mono" x="300" y="323">
                  规模继续增长，差距持续扩大
                </text>
              </svg>
              <figcaption class="tti-caption">
                启动成本随应用规模变化的示意。Qwik 的启动只与当前页面的交互有关，而不与组件总数线性相关。
              </figcaption>
            </figure>
          </div>

          <div class="section-side">
            <p class="label">02 / O(1) STARTUP</p>
            <h2 class="section-title">
              应用变大，
              <br />
              启动不变。
            </h2>
            <p class="section-lede">
              Qwik 的可恢复模型让服务端承担渲染，客户端只恢复状态。新增页面、组件和功能，不会自动变成首屏的 JavaScript 负担。
            </p>
            <ul class="section-list">
              <li>
                <span class="mono">A</span>
                首屏只发送内容与序列化状态。
              </li>
              <li>
                <span class="mono">B</span>
                事件代码在首次触发时下载。
              </li>
              <li>
                <span class="mono">C</span>
                预取让首次交互通常无需等待。
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section section-mechanisms">
        <div class="container">
          <div class="section-heading-row">
            <div>
              <p class="label">03 / HOW IT WORKS</p>
              <h2 class="section-title">五个机制，一个结果。</h2>
            </div>
            <p class="section-heading-note">
              不是把水合做得更快，而是把水合从架构里移除。
            </p>
          </div>

          <ol class="mechanism-list">
            {MECHANISMS.map((item, index) => (
              <li key={item.en}>
                <Link href={item.href} class="mechanism-row">
                  <span class="mechanism-num mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span class="mechanism-main">
                    <span class="mechanism-title">{item.title}</span>
                    <span class="mechanism-en mono">{item.en}</span>
                  </span>
                  <span class="mechanism-text">{item.text}</span>
                  <span class="mechanism-read mono">阅读</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section class="section section-optimizer">
        <div class="container">
          <div class="section-heading-row">
            <div>
              <p class="label">04 / OPTIMIZER</p>
              <h2 class="section-title">
                每个 <code class="title-code">$</code> 都是一个
                <br />
                懒加载边界。
              </h2>
            </div>
            <p class="section-heading-note">
              构建期切分，运行期按需加载。你写的是普通函数，Optimizer 负责边界。
            </p>
          </div>
          <OptimizerDemo />
        </div>
      </section>

      <section class="section section-router">
        <div class="container">
          <div class="section-heading-row">
            <div>
              <p class="label">05 / ROUTER & DATA</p>
              <h2 class="section-title">
                一次请求，
                <br />
                一条完整的数据路径。
              </h2>
            </div>
            <p class="section-heading-note">
              页面、loader、action 与端点共享同一个 RequestEvent，没有客户端与服务端两套数据逻辑。
            </p>
          </div>
          <RouterTabs />
        </div>
      </section>

      <section class="section section-docs">
        <div class="container docs-directory">
          <div class="docs-directory-side">
            <p class="label">06 / DOCUMENTATION</p>
            <h2 class="section-title">
              {ALL_DOCS.length} 篇，
              <br />
              从零到可恢复。
            </h2>
            <p class="section-lede">
              按心智模型、核心 API、路由与进阶组织。每一篇都能独立阅读，也都能在项目里直接运行。
            </p>
            <Link class="btn" href="/docs/">
              打开文档总览
            </Link>
          </div>

          <div class="docs-directory-list">
            {DOC_GROUPS.map((group, index) => (
              <div class="docs-directory-group" key={group.id}>
                <div class="docs-directory-group-head">
                  <span class="mono">0{index + 1}</span>
                  <span>{group.title}</span>
                  <span class="mono docs-directory-en">{group.en}</span>
                </div>
                <ul>
                  {group.docs.map((doc) => (
                    <li key={doc.slug}>
                      <Link href={getDocUrl(doc)}>
                        {doc.navTitle ?? doc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="closing">
        <div class="container closing-inner">
          <div class="closing-copy">
            <p class="label">NEXT / YOUR FIRST ROUTE</p>
            <h2 class="closing-title">
              把 JavaScript
              <br />
              <span>留给交互。</span>
            </h2>
            <p class="closing-lede">
              从一条路由开始，写一个 loader，加一个 signal。你会看到一个没有水合的应用如何运行。
            </p>
          </div>

          <div class="closing-actions">
            <div class="install-box">
              <span class="install-label mono">CREATE A PROJECT</span>
              <div class="install-command">
                <code>npm create qwik@latest</code>
                <CopyButton text="npm create qwik@latest" label="复制命令" />
              </div>
            </div>
            <div class="closing-links">
              <Link class="btn" href="/docs/getting-started/">
                开始构建
              </Link>
              <Link class="btn btn-ghost" href="/docs/faq/">
                先看常见问题
              </Link>
            </div>
          </div>
        </div>
        <div class="closing-mark" aria-hidden="true">
          QWIK
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik 中文 · 可恢复的 Web 框架",
  meta: [
    {
      name: "description",
      content:
        "Qwik 是面向现代 Web 的可恢复框架：HTML 立即可用，交互按需加载，应用规模增长而启动成本不变。",
    },
    { property: "og:title", content: "Qwik 中文 · 可恢复的 Web 框架" },
    {
      property: "og:description",
      content:
        "不用水合的前端框架。状态序列化进 HTML，事件代码按需加载，启动成本 O(1)。",
    },
    { property: "og:type", content: "website" },
  ],
};
