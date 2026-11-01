import type { Doc } from "./types";

export const advancedDocs: Doc[] = [
  {
    slug: "qrl",
    section: "advanced",
    title: "QRL 与懒加载边界",
    navTitle: "QRL",
    description: "理解可序列化的代码引用，以及 $ 到底改变了什么。",
    keywords: ["QRL", "qrl", "$", "懒加载", "序列化", "Optimizer"],
    blocks: [
      {
        type: "p",
        text: "QRL 是 Qwik URL 的缩写。它不是网络请求，而是一个可序列化的代码引用：指向某个 chunk 里的某个符号，必要时还携带闭包捕获的值。",
      },
      {
        type: "code",
        lang: "text",
        title: "QRL 的基本形状",
        code: `./chunks/counter.js#Counter_onClick[0,1]

# 之前：chunk 路径
# 之后：符号名
# 方括号：捕获变量在 q:obj 中的索引`,
      },
      { type: "h2", text: "从 JSX 到 HTML" },
      {
        type: "code",
        title: "你写的代码",
        code: `export const Counter = component\$(() => {
  const count = useSignal(0);

  return (
    <button onClick\$={() => count.value++}>
      {count.value}
    </button>
  );
});`,
      },
      {
        type: "p",
        text: "Optimizer 会把组件、事件处理函数与任务拆成独立模块。每个 `$` 都是切分点。服务端渲染后，HTML 中留下的是指针，而不是已经执行过的闭包。",
      },
      {
        type: "code",
        lang: "html",
        title: "SSR 输出（简化）",
        code: `<button q-e:click="./chunks/counter.js#Counter_onClick[0,1]">
  0
</button>
<script type="qwik/json">{ ... }</script>`,
      },
      {
        type: "p",
        text: "页面加载时只执行约 1 KB 的 qwikloader。用户点击按钮，qwikloader 冒泡找到 `q-e:click`，解析相对路径，加载对应 chunk，调用符号，再用 `useLexicalScope()` 恢复捕获的 signal。",
      },
      { type: "h2", text: "为什么不用 import()" },
      {
        type: "table",
        head: ["问题", "QRL 的解法"],
        rows: [
          ["动态 import 无法序列化到 HTML", "QRL 本身就是可写进 HTML 的字符串"],
          ["import 只到 chunk，不能指定符号", "URL 后带 #SymbolName"],
          ["相对路径离开模块后失去基准", "用 q:base 在 DOM 中解析"],
          ["闭包变量无法跨进程恢复", "索引引用 qwik/json 中的对象"],
          ["开发者手动切分边界", "Optimizer 根据 $ 自动切分"],
        ],
      },
      { type: "h2", text: "写 $ 函数时的规则" },
      {
        type: "list",
        items: [
          "捕获的局部变量必须是 const，并且可序列化。",
          "模块级变量必须被导入或导出，Optimizer 才能在新模块里重新引用它。",
          "不要捕获类实例、DOM 节点或函数；需要跨边界时改用可序列化数据或 noSerialize()。",
          "组件、任务、事件处理器分别成为独立符号，浏览器只下载真正执行的那部分。",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "$ 不是语法糖",
        text: "它是懒加载与序列化的边界。看到 $ 就要意识到：这段代码将离开当前模块，只能依赖可导入的符号与可序列化的捕获值。",
      },
    ],
  },
  {
    slug: "prefetching",
    section: "advanced",
    title: "预取与流式加载",
    navTitle: "预取与流式",
    description: "Qwik 如何预测下一步交互，并把代码提前放进浏览器缓存。",
    keywords: ["预取", "prefetch", "流式", "bundle graph", "speculative"],
    blocks: [
      {
        type: "p",
        text: "Qwik 的首屏不需要 JavaScript 就能交互吗？准确说：HTML 立即可见、链接立即可用，而事件处理函数在首次触发时才需要代码。为了不让首次点击等待网络，Qwik 会提前把可能用到的代码放进缓存。",
      },
      { type: "h2", text: "构建期的模块图" },
      {
        type: "p",
        text: "构建时会生成 `q-manifest.json` 与紧凑的 bundle graph，记录每个 bundle 中的符号、依赖关系，以及某个 bundle 加载后最可能继续请求哪些 bundle。Qwik Router 也会把每条路由及其依赖写进这张图。",
      },
      {
        type: "code",
        lang: "text",
        code: `q-manifest.json
  └── bundles
       ├── counter.js        → Counter_onClick
       ├── docs.js           → DocsPage, DocsSidebar
       └── search.js         → SearchDialog, searchIndex

build/q-bundle-graph-abc123.json
  └── 概率化的下一跳关系`,
      },
      {
        type: "p",
        text: "容器恢复时，Qwik 读取这张图，用 `<link rel=\"modulepreload\">` 预取静态依赖（高优先级）与动态依赖（低优先级）。浏览器决定何时真正下载。",
      },
      { type: "h2", text: "三条并行的预取线" },
      {
        type: "table",
        head: ["对象", "触发时机", "目的"],
        rows: [
          ["事件处理代码", "页面恢复后立即推测预取", "首次点击无需等待"],
          ["路由代码", "Link 进入视口", "SPA 导航瞬间完成"],
          ["路由数据", "用户表现导航意图", "页面与数据同时到达"],
        ],
      },
      {
        type: "p",
        text: "`<Link>` 可以分别控制这两类预取：`prefetchBundles` 默认 `visible`，`prefetchData` 默认 `intent`。需要节省流量时也可以显式关闭。",
      },
      {
        type: "code",
        code: `<Link href="/docs/" prefetchBundles="visible" prefetchData="intent">
  文档
</Link>`,
      },
      { type: "h2", text: "消除网络瀑布" },
      {
        type: "p",
        text: "传统模块加载是串行的：A 下载完才知道要 B，B 下载完才知道要 C。Qwik 在服务端就知道整张图，因此可以一次性告诉浏览器接下来需要哪些模块，把瀑布变成并行。",
      },
      {
        type: "callout",
        tone: "warn",
        title: "开发环境看不到完整效果",
        text: "dev 模式下没有生产 bundle graph，预取能力有限。要验证真实的预取与流式行为，请运行 `bun run preview` 使用生产构建。",
      },
      { type: "h2", text: "流式渲染" },
      {
        type: "p",
        text: "SSR 不等整个页面就绪才发送。静态外壳先到，异步边界完成后以独立片段追加。Qwik 支持乱序流式：慢的部分不会阻塞已经准备好的部分。",
      },
      {
        type: "list",
        items: [
          "首字节更早，用户更早看到内容。",
          "慢 loader 只影响读取它的组件，而不是整页。",
          "片段到达后即可恢复，交互与后续内容并行。",
        ],
      },
    ],
  },
  {
    slug: "best-practices",
    section: "advanced",
    title: "性能实践",
    navTitle: "性能实践",
    description: "把读取放对位置，让 Qwik 的细粒度更新真正生效。",
    keywords: ["性能", "最佳实践", "useComputed", "useVisibleTask", "useOn"],
    blocks: [
      {
        type: "p",
        text: "Qwik 的性能来自精确的订阅：谁读取了状态，状态变化时就只更新谁。写法会直接决定订阅的范围。以下几条规则能避免把细粒度更新变回整页重渲染。",
      },
      { type: "h2", text: "在模板里读取，而不是提前计算" },
      {
        type: "code",
        title: "不推荐",
        code: `const count = useSignal(0);
const label = count.value > 0 ? '正数' : '零或负数';

return <div>{label}</div>;`,
      },
      {
        type: "code",
        title: "推荐",
        code: `const count = useSignal(0);

return (
  <div>
    {count.value > 0 ? '正数' : '零或负数'}
  </div>
);`,
      },
      {
        type: "p",
        text: "组件函数内读取 signal 会让整个组件成为订阅者。把读取放进 JSX，订阅范围缩小到具体的 DOM 节点。派生值较复杂时，用 `useComputed$()` 把计算与订阅隔离。",
      },
      {
        type: "code",
        code: `const count = useSignal(0);
const doubled = useComputed\$(() => count.value * 2);

return <output>{doubled.value}</output>;`,
      },
      { type: "h2", text: "把 useVisibleTask$ 当逃生舱" },
      {
        type: "p",
        text: "`useVisibleTask$()` 会急切执行并阻塞主线程，它应当是最后手段。多数需求有更轻的替代：",
      },
      {
        type: "table",
        head: ["需求", "替代方案"],
        rows: [
          ["监听元素事件", "useOn() 或 JSX 上的 onClick$"],
          ["监听 window / document", "useOnWindow() / useOnDocument()"],
          ["响应状态变化", "useTask$() + track()"],
          ["只需要执行一次的客户端逻辑", "useOn('qidle') 或 useOn('qvisible')"],
          ["读取路由信息", "useLocation()"],
        ],
      },
      {
        type: "code",
        title: "用 useOnDocument 代替手动绑定",
        code: `useOnDocument(
  'mousemove',
  \$((event) => {
    pointer.value = {
      x: (event as MouseEvent).clientX,
      y: (event as MouseEvent).clientY,
    };
  })
);`,
      },
      {
        type: "p",
        text: "这样监听器只在事件真正发生时加载，而不是页面一出现就下载并执行。",
      },
      { type: "h2", text: "不要在浏览器里读位置" },
      {
        type: "p",
        text: "`window.location` 只存在于客户端。用 `useLocation()` 可以在 SSR 阶段就拿到同样的信息，把分支渲染进 HTML，而不是等到浏览器再补。",
      },
      {
        type: "code",
        code: `const loc = useLocation();

if (loc.url.pathname.startsWith('/docs')) {
  // 服务端与客户端行为一致
}`,
      },
      { type: "h2", text: "其他小规则" },
      {
        type: "list",
        items: [
          "状态尽量靠近使用它的组件，避免在根组件创建所有 signal。",
          "需要共享时优先用 context，而不是层层传参。",
          "列表项作为独立组件，读取各自的数据，避免父级订阅整个数组。",
          "图片与字体是首屏大头，框架再快也救不了巨大的资源。",
          "生产环境验证：dev 下的 chunk 数量与预取行为都和线上不同。",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "衡量而非猜测",
        text: "用 Lighthouse、WebPageTest 或真实用户数据确认瓶颈。Qwik 优化的目标是 TTI 与交互延迟，而不是让 bundle 数字好看。",
      },
    ],
  },
  {
    slug: "glossary",
    section: "advanced",
    title: "术语表",
    navTitle: "术语表",
    description: "可恢复、序列化、QRL、容器：读文档时最常见的词。",
    keywords: ["术语", "glossary", "概念", "词汇表"],
    blocks: [
      {
        type: "p",
        text: "这一页把 Qwik 文档里的高频术语放在一起。不需要一次记住，遇到陌生词时回来查即可。",
      },
      { type: "h2", text: "核心概念" },
      {
        type: "table",
        head: ["术语", "含义"],
        rows: [
          ["可恢复 Resumability", "服务端把状态与监听器序列化进 HTML，客户端从断点继续，不重新执行组件。"],
          ["水合 Hydration", "其他框架在客户端重新执行组件、重建状态并重新绑定监听器的过程。Qwik 不做这一步。"],
          ["序列化 Serialization", "把状态、QRL 与框架结构转成文本嵌入 HTML，供浏览器恢复。"],
          ["容器 Container", "页面中一个可独立恢复的 Qwik 区域。一个页面可以有多个容器。"],
          ["暂停态 Paused", "SSR 完成后、客户端尚未恢复的容器状态。"],
        ],
      },
      { type: "h2", text: "代码与加载" },
      {
        type: "table",
        head: ["术语", "含义"],
        rows: [
          ["QRL", "可序列化的代码引用：chunk 路径 + 符号名 + 捕获变量索引。"],
          ["Optimizer", "构建期工具，按 $ 边界切分代码并生成 QRL，核心用 Rust 编写。"],
          ["Qwikloader", "内联在 HTML 中的极小运行时，负责全局事件委托与按需加载。"],
          ["Chunk / Bundle", "包含一个或多个符号的 JavaScript 文件，按需下载。"],
          ["预取 Prefetching", "提前把可能用到的代码或数据放进浏览器缓存。"],
          ["网络瀑布 Waterfall", "请求必须串行等待前一个完成的低效模式。"],
        ],
      },
      { type: "h2", text: "响应式" },
      {
        type: "table",
        head: ["术语", "含义"],
        rows: [
          ["Signal", "useSignal() 创建的响应式值，通过 .value 读写。"],
          ["Store", "useStore() 创建的代理对象，深度跟踪属性变化。"],
          ["ComputedSignal", "useComputed$() 或 loader 返回的只读派生值。"],
          ["订阅 Subscription", "读取状态时自动建立的关系，状态变化时触发精确更新。"],
          ["Track", "useTask$() 中显式声明依赖的函数。"],
          ["失效 Invalidate", "标记某段派生值或任务需要重新计算。"],
          ["vNode", "Qwik 内部对 DOM 结构的轻量描述，只在结构变化时使用。"],
        ],
      },
      { type: "h2", text: "渲染与部署" },
      {
        type: "table",
        head: ["术语", "含义"],
        rows: [
          ["SSR", "服务端渲染：请求时生成 HTML。"],
          ["SSG", "构建期预渲染：把页面生成为静态文件，可直接由 CDN 提供。"],
          ["CSR", "客户端渲染：在浏览器里生成页面，首屏通常更慢。"],
          ["MPA / SPA", "整页跳转 / 无刷新跳转。Qwik 可以按每个链接选择。"],
          ["流式 Stream", "边生成边发送 HTML，支持乱序片段。"],
          ["入口 Entry", "客户端、SSR 或预览的启动文件，负责创建与恢复容器。"],
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "记住这三个就够开始",
        text: "可恢复解决启动成本，QRL 解决按需加载，signal 解决精确更新。其余术语都是这三件事的延伸。",
      },
    ],
  },
  {
    slug: "faq",
    section: "advanced",
    title: "常见问题",
    navTitle: "常见问题",
    description: "关于学习曲线、chunk 数量、vDOM、浏览器支持与取舍。",
    keywords: ["FAQ", "常见问题", "vDOM", "chunk", "浏览器"],
    blocks: [
      { type: "h2", text: "Qwik 难学吗？" },
      {
        type: "p",
        text: "语法与 JSX、hooks 的体验接近其他响应式框架，差异主要在 SSR 优先的心智模型：区分 `useTask$` 与 `useVisibleTask$`，理解 `$` 是序列化边界。这些规则在写代码时会给出明确反馈，比水合不一致的运行时错误更容易排查。",
      },
      { type: "h2", text: "为什么到处都是 $？" },
      {
        type: "p",
        text: "`$` 标记懒加载边界。Optimizer 把函数移到独立模块，并在原地留下 QRL。组件、任务、事件处理器因此可以单独下载与执行。它不是 jQuery，也不是模板语法。",
      },
      { type: "h2", text: "按交互懒加载会不会更慢？" },
      {
        type: "p",
        text: "Qwik 在启动时就预测并预取可能触发的代码，多数情况下首次点击时代码已经在缓存里。真正拖慢交互的是启动时执行大量用不到的代码，而这正是可恢复架构避免的部分。",
      },
      { type: "h2", text: "会产生太多 chunk 吗？" },
      {
        type: "p",
        text: "开发模式尽量细拆，方便调试。生产构建会把相关符号合并成合理的 bundle，在请求数与缓存命中之间取平衡。",
      },
      { type: "h2", text: "Qwik 用虚拟 DOM 吗？" },
      {
        type: "p",
        text: "大多数更新不经过 vDOM：signal 直接更新对应的文本或属性。只有结构变化（例如条件渲染换成另一种元素）时才使用 vNode 树，而且不会重新执行 hooks。",
      },
      { type: "h2", text: "可以做 SPA 吗？" },
      {
        type: "p",
        text: "可以，而且可以按链接选择。`<Link>` 触发 SPA 导航，普通 `<a>` 就是整页跳转。架构不再是非此即彼的选择。",
      },
      { type: "h2", text: "和岛屿架构、局部水合有什么区别？" },
      {
        type: "p",
        text: "岛屿架构需要手动圈出交互区域，岛与岛之间难以共享状态。Qwik 不水合任何组件，而是从整页序列化状态恢复，交互区域自动按需加载，彼此仍能通过 signal 与 context 通信。",
      },
      { type: "h2", text: "HTML 里会不会序列化太多数据？" },
      {
        type: "p",
        text: "只序列化当前页面真正用到的状态。页面有一千个组件但只有一个可交互，数据量取决于交互复杂度，而不是组件数量。",
      },
      { type: "h2", text: "浏览器支持如何？" },
      {
        type: "p",
        text: "Qwik 构建在 Vite 之上，面向现代浏览器。具体范围与 Vite 的浏览器兼容目标一致。",
      },
      { type: "h2", text: "代价是什么？" },
      {
        type: "p",
        text: "需要学习异步 `$` 语法与序列化规则；生态相对年轻，个别库需要 `qwikify$` 适配；某些 SSR 与响应式性能仍在持续优化。换来的是应用规模增长时启动成本基本不变。",
      },
      {
        type: "callout",
        tone: "tip",
        title: "接下来读什么",
        text: "如果你刚看完这一页，建议回到「心智模型」按顺序读三篇，再进入核心 API 动手写组件。",
      },
    ],
  },
];
