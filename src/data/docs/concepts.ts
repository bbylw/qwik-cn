import type { Doc } from "./types";

export const conceptDocs: Doc[] = [
  {
    slug: "concepts/think-qwik",
    section: "concepts",
    title: "心智模型",
    navTitle: "Think Qwik",
    description: "用 JavaScript streaming 理解 Qwik：为什么首屏可交互时间可以是一个常量。",
    keywords: ["Think Qwik", "JavaScript streaming", "TTI", "水合", "心智模型"],
    blocks: [
      {
        type: "p",
        text: "如果你用过 React、Vue、Svelte 或 Solid，组件、响应式和 JSX 都不陌生。Qwik 的不同之处在于它如何把 JavaScript 送到浏览器：不是先全部下载再执行，而是像视频一样边播边缓冲。",
      },
      {
        type: "quote",
        text: "视频不必等整部下载完才能播放。用户可以立即开始，也可以跳到任意位置；已经缓冲的部分立即响应，没有缓冲的部分稍微等一会儿。JavaScript streaming 做的是同一件事，只不过它优化的是「不执行代码」。",
      },
      { type: "h2", text: "水合到底在做什么" },
      {
        type: "p",
        text: "常规 SSR 框架会先生成 HTML，然后在浏览器里重新执行组件模板，重建组件树、找到事件监听器、恢复状态。这一步叫水合（hydration）。页面看起来已经完成，实际上框架还在后台重放服务端做过的工作。",
      },
      {
        type: "list",
        items: [
          "**监听器**：重新找到 DOM 节点并绑定事件。",
          "**组件树**：重新执行模板，建立组件边界与更新关系。",
          "**状态**：把服务端取到的数据重新放回 store。",
        ],
      },
      {
        type: "p",
        text: "水合的成本有两层：下载当前页面的全部组件代码，以及执行这些代码。应用越大，首屏可交互时间（TTI）越接近线性增长。",
      },
      { type: "h2", text: "Qwik 的选择：暂停与续接" },
      {
        type: "p",
        text: "Qwik 在服务端渲染完成后不销毁现场。组件边界、事件引用、状态和订阅关系被序列化进 HTML。浏览器不需要重建这些信息，而是在用户第一次交互时，恢复对应的一小部分执行环境。",
      },
      {
        type: "table",
        head: ["", "常规 SSR + 水合", "Qwik"],
        rows: [
          ["首屏", "HTML 可用，但需等待 JS 才能交互", "HTML 可用，交互在第一次操作时续接"],
          ["启动成本", "随页面代码量增长", "与首个交互所需的符号相关"],
          ["事件代码", "随组件一起下载", "交互时才下载"],
          ["组件树", "浏览器重新执行模板重建", "从 HTML 中恢复"],
        ],
      },
      { type: "h2", text: "五个机制一起工作" },
      {
        type: "list",
        ordered: true,
        items: [
          "**细粒度响应式（signals）**：状态变化只更新订阅它的 DOM，不需要重渲染整棵子树。",
          "**自动代码拆分（Optimizer）**：按 `$` 抽取符号，构建期生成可以在运行时独立加载的 chunk。",
          "**状态序列化（resumability）**：把状态、监听器、组件边界和订阅图写进 HTML。",
          "**即时事件注册（Qwikloader）**：一段很小的内联脚本先接管用户事件，此时应用代码还不需要存在。",
          "**缓冲预加载（Preloader）**：页面 `load` 之后空闲预取最可能用到的符号，交互发生时优先插队加载。",
        ],
      },
      {
        type: "p",
        text: "这五个机制缺一不可。没有信号，单个交互会迫使整棵子树重新渲染；没有 Optimizer，代码无法被拆成可独立加载的符号；没有序列化，浏览器就必须重放。",
      },
      { type: "h2", text: "为什么 TTI 可以接近 O(1)" },
      {
        type: "p",
        text: "在 Qwik 中，页面加载后并不需要执行所有组件。用户点击按钮时，Qwikloader 已经记录了这个事件；Qwik 解析 HTML 中的引用，下载事件处理函数及其依赖，然后执行。其他组件的代码可以继续躺在缓存里。",
      },
      {
        type: "p",
        text: "因此 TTI 不取决于页面有多少功能，而取决于首个交互需要多少代码。一个包含上百个组件的页面，也可以用很小的启动成本变得可交互。",
      },
      {
        type: "callout",
        tone: "warn",
        title: "SSR 是一等公民",
        text: "Qwik 应用也可以在纯客户端渲染，但那样浏览器必须先下载渲染函数才能生成 DOM，可恢复性的优势会消失。生产应用通常使用 SSR 或 SSG。",
      },
      { type: "h2", text: "这意味着什么" },
      {
        type: "list",
        items: [
          "**可扩展**：功能增加不必以首屏变慢为代价，团队不需要为了性能停止加功能。",
          "**开发者省心**：懒加载边界由构建器生成，不需要手工规划 `import()`。",
          "**用户更快**：弱网与低端设备上，首屏可交互时间更稳定。",
        ],
      },
      {
        type: "p",
        text: "接下来读[可恢复性](/docs/concepts/resumable/)，看 Qwik 具体把哪些信息写进了 HTML。",
      },
    ],
  },
  {
    slug: "concepts/resumable",
    section: "concepts",
    title: "可恢复性",
    navTitle: "可恢复性",
    description: "Qwik 不做水合，而是把服务端状态序列化进 HTML，在浏览器从断点继续。",
    keywords: ["resumability", "hydration", "序列化", "q-e:click", "状态恢复"],
    blocks: [
      {
        type: "p",
        text: "可恢复性（resumability）的核心是一句话：在服务端暂停执行，在浏览器从暂停处继续。应用不需要在客户端重放服务端做过的事。",
      },
      {
        type: "p",
        text: "要理解它，先看水合必须恢复的三件东西：监听器、组件树、应用状态。Qwik 用序列化逐个解决，因此浏览器可以在没有任何应用代码的情况下启动。",
      },
      { type: "h2", text: "监听器：写进 DOM" },
      {
        type: "p",
        text: "常规框架要下载组件、执行模板，才能知道哪个 DOM 节点该绑定哪个函数。Qwik 在 SSR 阶段就把监听器信息写进属性，浏览器只需要一个全局监听器来代理事件：",
      },
      {
        type: "code",
        lang: "html",
        title: "SSR 输出（示意）",
        code: `<button q-e:click="./chunk.js#s_LToOrb0bX0M">
  click me
</button>`,
      },
      {
        type: "p",
        text: "Qwikloader 先在 `document` 上注册一个通用监听器。用户点击时，它从属性里读出 chunk 与符号名，按需下载并执行。事件处理函数不是页面启动的一部分，而是交互的结果。",
      },
      { type: "h2", text: "组件树：边界信息随 HTML 一起到达" },
      {
        type: "p",
        text: "水合需要知道组件边界，才能决定状态变化时重渲染谁。常规 HTML 丢失了这些信息，所以框架必须重新执行模板。Qwik 把组件层次、属性与 DOM 的对应关系序列化进 HTML，浏览器不需要执行组件就能恢复结构。",
      },
      {
        type: "p",
        text: "更重要的是，Qwik 把状态与 DOM 的订阅关系也写进了 HTML。当某个 signal 改变时，Qwik 知道需要更新哪几个文本节点或属性，而不是重跑整个组件。",
      },
      { type: "h2", text: "状态：不只是 JSON" },
      {
        type: "p",
        text: "JSON 无法表达循环引用、Date、Map、Set、Promise、DOM 引用和函数闭包。Qwik 的序列化格式支持这些类型，因此 store、资源与事件闭包可以跨过服务端与浏览器的边界。",
      },
      {
        type: "table",
        head: ["可以序列化", "不能序列化"],
        rows: [
          ["基本类型、对象、数组", "自定义 class 的实例与原型"],
          ["Date、URL、Map、Set", "Streams"],
          ["Promise、资源", "未包装为 QRL 的函数"],
          ["QRL 包装的闭包", "DOM 节点之外的宿主对象"],
        ],
      },
      {
        type: "code",
        title: "闭包的捕获规则",
        code: `component\$(() => {
  const label = '可序列化'; // const + 可序列化
  return <button onClick\$={() => console.log(label)}>log</button>;
});`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "闭包捕获必须是 const",
        text: "被 QRL 捕获的局部变量必须是 `const`，并且值必须可序列化。否则 Optimizer 无法把它安全地关闭并恢复。",
      },
      { type: "h2", text: "为什么这能加速启动" },
      {
        type: "list",
        items: [
          "浏览器不需要下载组件模板就能让页面响应。",
          "每个组件、任务、事件都可以独立恢复，父组件代码不必存在。",
          "状态变化只更新订阅它的 DOM，减少内存压力与重渲染。",
          "同一份序列化状态可以被缓存、传输，甚至用于离线恢复。",
        ],
      },
      { type: "h2", text: "写应用时的约束" },
      {
        type: "p",
        text: "可恢复性不只属于框架，也属于应用。凡是需要跨过服务端与客户端边界的状态，都应该以可序列化的形式表达。无法序列化的对象可以留在客户端，用 `noSerialize()` 标记，或者放进只在浏览器运行的 `useVisibleTask$`。",
      },
      {
        type: "p",
        text: "下一页[渐进式加载](/docs/concepts/progressive/)会解释：既然一切都是符号，Qwik 如何决定什么时候加载哪个符号。",
      },
    ],
  },
  {
    slug: "concepts/progressive",
    section: "concepts",
    title: "渐进式加载",
    navTitle: "渐进式加载",
    description: "Qwik 把懒加载变成框架的默认路径：组件、任务、事件与样式都可以按需到达。",
    keywords: ["lazy loading", "optimizer", "$", "代码分割", "渐进式"],
    blocks: [
      {
        type: "p",
        text: "大多数框架把懒加载边界交给开发者：用 `import()` 包一层，或者配置路由级拆分。问题是，页面已经在渲染树上的组件无法被懒加载，因为框架需要它们来重建状态。",
      },
      {
        type: "p",
        text: "Qwik 把这件事反过来。Optimizer 在构建时把组件拆成多个符号，运行时按需请求。即使组件已经出现在首屏，事件处理和任务代码也可以继续留在服务器上。",
      },
      { type: "h2", text: "Optimizer 在构建期做了什么" },
      {
        type: "p",
        text: "你写普通的函数。任何以 `$` 结尾的调用都会成为提取点：Optimizer 把函数体移到独立模块，留下一个 QRL（Qwik Resource Locator）引用。",
      },
      {
        type: "code",
        title: "src/components/counter.tsx",
        code: `export const Counter = component\$(() => {
  const count = useSignal(0);

  useTask\$(({ track }) => {
    track(count);
    console.log('count', count.value);
  });

  return <button onClick\$={() => count.value++}>{count.value}</button>;
});`,
      },
      {
        type: "p",
        text: "上面的组件至少会拆成三个符号：渲染函数、响应任务、点击处理。三者可以在不同时间下载，也可以在不同时间执行。",
      },
      { type: "h2", text: "所有东西都可以是符号" },
      {
        type: "list",
        items: [
          "**组件渲染**：只有在需要重新渲染时才加载。",
          "**任务（tasks）**：只有被跟踪的状态发生变化时才运行。",
          "**事件监听器**：用户真正交互时才下载。",
          "**样式**：服务端已经内联的样式不会重复下载。",
          "**数据**：route loader 的结果在服务端生成，只传结果，不传逻辑。",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "懒加载不是附加功能",
        text: "Qwik 运行时默认代码可能还不在内存里。框架从设计上就接受异步，因此不需要开发者手动处理加载状态。",
      },
      { type: "h2", text: "预加载：不让第一次交互等待" },
      {
        type: "p",
        text: "按需加载不等于第一次点击一定慢。页面完成加载后，Preloader 会根据构建期生成的 bundle graph，空闲预取最可能被用到的符号。用户点击时，如果代码已经缓存，执行几乎是即时的；如果没有，Qwik 会把请求插到队列前面。",
      },
      {
        type: "code",
        lang: "bash",
        title: "验证预加载",
        code: `bun run preview
# 打开 DevTools > Network，点击页面上的按钮
# 观察 modulepreload 与 chunk 请求`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "开发模式看不到完整效果",
        text: "开发服务器没有生产环境的 bundle graph，Speculative Module Fetching 不完整。请用 `preview` 验证加载行为。",
      },
      {
        type: "p",
        text: "继续读[响应式](/docs/concepts/reactivity/)，理解为什么 Qwik 可以只更新一小块 DOM，而不触发整棵组件树。",
      },
    ],
  },
  {
    slug: "concepts/reactivity",
    section: "concepts",
    title: "响应式",
    navTitle: "响应式",
    description: "Qwik 用 signal 与 proxy 记录订阅关系，只更新真正依赖状态的 DOM。",
    keywords: ["signals", "useStore", "proxy", "订阅", "重渲染"],
    blocks: [
      {
        type: "p",
        text: "Qwik 不做脏检查，也不在每次状态变化时重渲染整棵组件树。状态通过 signal 和 store proxy 暴露；读取时建立订阅，写入时只更新订阅者。",
      },
      { type: "h2", text: "订阅图从哪里来" },
      {
        type: "p",
        text: "组件在服务端第一次渲染时，Qwik 会记录模板读取了哪些状态。比如下面的 `store.count`，会让计数文本节点订阅 `count`。这份映射与状态一起被序列化。",
      },
      {
        type: "code",
        title: "src/components/counter.tsx",
        code: `export const Counter = component\$(() => {
  const store = useStore({ count: 0 });

  return (
    <button onClick\$={() => store.count++}>
      {store.count}
    </button>
  );
});`,
      },
      {
        type: "p",
        text: "浏览器点击按钮后，事件处理函数恢复 `store`，写入 `count`。proxy 捕获写入，找到订阅了 `count` 的文本节点，直接更新它。整个组件函数不需要重新运行。",
      },
      { type: "h2", text: "更新粒度" },
      {
        type: "p",
        text: "当一个组件确实需要重新渲染时，只有属性发生变化的子组件会失效。下面的例子中，点击第三颗按钮不会导致任何 `Child` 重新渲染，也不会加载它们的代码：",
      },
      {
        type: "code",
        title: "只在 props 变化时更新子组件",
        code: `export const Child = component\$((props: { count: number }) => {
  return <span>{props.count}</span>;
});

export const App = component\$(() => {
  const store = useStore({ a: 0, b: 0, c: 0 });

  return (
    <>
      <button onClick\$={() => store.a++}>a</button>
      <button onClick\$={() => store.b++}>b</button>
      <button onClick\$={() => store.c++}>c</button>
      <Child count={store.a} />
      <Child count={store.b} />
    </>
  );
});`,
      },
      { type: "h2", text: "乱序渲染" },
      {
        type: "p",
        text: "Qwik 组件可以脱离父组件独立渲染。父组件不需要先执行，子组件也不需要跟着父组件一起重渲染。这是渐进式加载能够成立的前提：恢复一个组件，不必恢复它的整条祖先链。",
      },
      {
        type: "p",
        text: "这种独立性要求 props 可序列化。父组件创建 props，子组件从 HTML 中恢复它们，而不是重新执行父组件。",
      },
      {
        type: "callout",
        tone: "warn",
        title: "不要解构 store",
        text: "`const { count } = store` 会得到一个普通变量。之后的读取不再经过 proxy，Qwik 也无法跟踪更新。保持 `store.count` 的访问方式。",
      },
      {
        type: "p",
        text: "store 会自动把嵌套对象也包成 proxy，方便是方便，但对象身份会变化。需要浅层跟踪时，可以传 `{ deep: false }`。",
      },
      {
        type: "p",
        text: "理解了订阅图，就可以进入[状态](/docs/core/state/)的具体 API。",
      },
    ],
  },
];
