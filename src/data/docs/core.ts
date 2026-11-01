import type { Doc } from "./types";

export const coreDocs: Doc[] = [
  {
    slug: "core/state",
    section: "core",
    title: "状态",
    navTitle: "状态",
    description: "useSignal、useStore、useComputed$ 与可序列化状态。",
    keywords: ["useSignal", "useStore", "useComputed", "noSerialize", "状态"],
    blocks: [
      {
        type: "p",
        text: "Qwik 的状态分两类：普通可序列化数据，以及能触发 UI 更新的响应式状态。响应式状态用 `useSignal()` 或 `useStore()` 创建。",
      },
      { type: "h2", text: "useSignal()" },
      {
        type: "p",
        text: "signal 是一个带 `.value` 属性的对象。读写 `.value` 会被 Qwik 跟踪：",
      },
      {
        type: "code",
        title: "src/components/counter.tsx",
        code: `import { component\$, useSignal } from '@qwik.dev/core';

export default component\$(() => {
  const count = useSignal(0);

  return (
    <button onClick\$={() => count.value++}>
      点击 {count.value} 次
    </button>
  );
});`,
      },
      { type: "demo", kind: "counter" },
      {
        type: "p",
        text: "把 signal 传给子组件时有两种选择：传 `signal.value` 只传当前值；传 `signal` 本身，子组件就能读写它。",
      },
      { type: "h2", text: "useStore()" },
      {
        type: "p",
        text: "store 是对象版的 signal。Qwik 默认深度跟踪嵌套对象与数组：",
      },
      {
        type: "code",
        code: `const state = useStore({
  name: 'Qwik',
  meta: { stars: 0 },
  tags: ['resumable'],
});

state.meta.stars++;
state.tags.push('streaming');`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "不要解构 store",
        text: "解构会得到普通变量，Qwik 无法跟踪后续写入。保持 `state.meta.stars` 这样的属性访问。大对象如果不需要深层跟踪，可以传第二个参数 `{ deep: false }`。",
      },
      {
        type: "p",
        text: "store 中的方法需要用 `$()` 包装才能序列化。需要 `this` 时使用 `function` 关键字，并在类型里显式声明：",
      },
      {
        type: "code",
        code: `const counter = useStore<{
  count: number;
  increment: QRL<(this: typeof counter) => void>;
}>({
  count: 0,
  increment: \$(function () {
    this.count++;
  }),
});`,
      },
      { type: "h2", text: "useComputed$()" },
      {
        type: "p",
        text: "派生值用 `useComputed$`。它只重新计算依赖变化的部分，不会让整个组件重新渲染：",
      },
      {
        type: "code",
        code: `const price = useSignal(120);
const quantity = useSignal(2);
const total = useComputed\$(() => price.value * quantity.value);

return <p>合计 {total.value} 元</p>;`,
      },
      {
        type: "p",
        text: "异步派生值同样可以交给 `useComputed$`。它不会阻塞首次渲染，并且可以拿到 `abortSignal` 取消上一次请求：",
      },
      {
        type: "code",
        code: `const query = useSignal('');
const results = useComputed\$(async ({ abortSignal }) => {
  const res = await fetch(\`/api/search?q=\${query.value}\`, {
    signal: abortSignal,
  });
  return res.json();
}, { initial: [] });`,
      },
      { type: "h2", text: "useConstant()" },
      {
        type: "p",
        text: "只在组件整个生命周期内计算一次的值，用 `useConstant()`。它不具响应性，适合随机 id、配置对象这类不需要触发更新的数据。",
      },
      { type: "h2", text: "共享状态" },
      {
        type: "list",
        items: [
          "**props**：父子组件之间最直接的方式，props 必须可序列化。",
          "**context**：跨越多层组件，见[上下文](/docs/core/context/)。",
          "**store 方法**：把行为与状态放在同一个可序列化对象里。",
        ],
      },
      { type: "h2", text: "序列化边界" },
      {
        type: "p",
        text: "需要跨过服务端与客户端边界的状态必须可序列化。无法序列化的对象（例如浏览器 API 实例、第三方类实例）可以用 `noSerialize()` 标记：",
      },
      {
        type: "code",
        code: `import { noSerialize, useStore } from '@qwik.dev/core';

const state = useStore({
  chart: noSerialize(new Chart(canvas)),
});`,
      },
      {
        type: "callout",
        tone: "note",
        title: "noSerialize 不是万能钥匙",
        text: "被标记的值不会跨边界恢复。如果浏览器端需要它，请在 `useVisibleTask$` 或事件处理中重新创建，而不是依赖服务端实例。",
      },
    ],
  },
  {
    slug: "core/events",
    section: "core",
    title: "事件",
    navTitle: "事件",
    description: "用 on{Event}$ 注册懒加载事件，理解异步事件与声明式修饰符。",
    keywords: ["onClick$", "preventDefault", "stopPropagation", "window", "事件"],
    blocks: [
      {
        type: "p",
        text: "事件用 `on{EventName}$` 属性注册。`$` 表示这里是一个懒加载边界：处理函数只有用户真正触发事件时才会下载。",
      },
      {
        type: "code",
        code: `<button onClick\$={() => count.value++}>
  +1
</button>`,
      },
      { type: "h2", text: "复用处理函数" },
      {
        type: "p",
        text: "同一个函数要绑到多个元素时，用 `$()` 包成 QRL，再传给事件属性：",
      },
      {
        type: "code",
        code: `const increment = \$(() => count.value++);

return (
  <>
    <button onClick\$={increment}>+</button>
    <button onClick\$={increment}>再来一次</button>
  </>
);`,
      },
      {
        type: "p",
        text: "多个处理函数可以放进数组，按顺序执行：",
      },
      {
        type: "code",
        code: `<button onClick\$={[logClick, increment, track]}>
  点击
</button>`,
      },
      { type: "demo", kind: "counter" },
      { type: "h2", text: "异步事件的三条限制" },
      {
        type: "p",
        text: "Qwik 的事件处理是异步的：首次触发时，代码可能还在下载。因此事件对象上的这些 API 不可用：",
      },
      {
        type: "list",
        items: [
          "`event.preventDefault()`",
          "`event.stopPropagation()`",
          "`event.currentTarget`",
        ],
      },
      {
        type: "p",
        text: "Qwik 用声明式属性替代前两个；`currentTarget` 作为处理函数的第二个参数传入。",
      },
      {
        type: "code",
        title: "声明式修饰符",
        code: `<a
  href="/docs"
  preventdefault:click
  stoppropagation:click
  onClick\$={() => {
    // 不要在这里调用 event.preventDefault()
  }}
>
  打开文档
</a>`,
      },
      {
        type: "p",
        text: "处理函数的签名是 `(event, element)`。需要当前元素时用第二个参数：",
      },
      {
        type: "code",
        code: `<input
  onInput\$={(_, input) => {
    query.value = input.value;
  }}
/>`,
      },
      { type: "h2", text: "passive 与 capture" },
      {
        type: "p",
        text: "滚动、触摸等高频事件可以标记为 passive，让浏览器跳过等待处理函数的步骤。需要在捕获阶段执行时，用 `capture:eventname`：",
      },
      {
        type: "code",
        code: `<div passive:touchmove onTouchMove\$={() => {}} />
<div capture:click onClick\$={() => {}} />`,
      },
      {
        type: "callout",
        tone: "note",
        title: "不要混用",
        text: "同一个事件不能既 passive 又 preventdefault。前者承诺不会阻止默认行为，后者需要阻止。Qwik 会给出优化器警告。",
      },
      { type: "h2", text: "window 与 document 事件" },
      {
        type: "p",
        text: "全局事件用 `window:on*` 与 `document:on*` 前缀。它们同样保持懒加载，并在组件销毁时自动清理：",
      },
      {
        type: "code",
        code: `<div
  window:onScroll\$={() => {
    scrolled.value = true;
  }}
  document:onKeyDown\$={(event) => {
    if (event.key === 'Escape') close();
  }}
/>`,
      },
      {
        type: "p",
        text: "在可复用的 hook 中无法写 JSX 时，用 `useOn()`、`useOnWindow()`、`useOnDocument()`，回调同样要用 `$()` 包装。",
      },
      { type: "h2", text: "同步事件：sync$" },
      {
        type: "p",
        text: "极少数场景必须在事件分发阶段同步执行，例如在浏览器原生行为发生前读取选区。`sync$()` 可以把一段代码内联进 HTML，代价是失去懒加载：",
      },
      {
        type: "code",
        code: `import { sync\$ } from '@qwik.dev/core';

<button
  onClick\$={sync\$((event) => {
    event.preventDefault();
  })}
/>;`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "sync$ 是例外",
        text: "`sync$` 的代码会随 HTML 内联，不能访问组件作用域中的变量。能用声明式修饰符解决时，不要用它。",
      },
    ],
  },
  {
    slug: "core/tasks",
    section: "core",
    title: "任务与生命周期",
    navTitle: "任务与生命周期",
    description: "useTask$、useVisibleTask$、track 与清理函数。",
    keywords: ["useTask$", "useVisibleTask$", "track", "cleanup", "生命周期"],
    blocks: [
      {
        type: "p",
        text: "Qwik 只有三个生命周期阶段：Task、Render、VisibleTask。因为组件在服务端和浏览器之间只挂载一次，大多数副作用不需要在两边各跑一遍。",
      },
      {
        type: "table",
        head: ["阶段", "运行位置", "典型用途"],
        rows: [
          ["Task", "服务端或浏览器", "初始化、读取数据、跟踪状态变化"],
          ["Render", "服务端或浏览器", "生成 JSX 与 DOM"],
          ["VisibleTask", "浏览器", "需要真实 DOM 或可见性信息的副作用"],
        ],
      },
      { type: "h2", text: "useTask$()" },
      {
        type: "p",
        text: "`useTask$` 在首次渲染前运行，可以阻塞渲染。没有 `track()` 时，它在组件生命周期内只运行一次。",
      },
      {
        type: "code",
        title: "src/components/clock.tsx",
        code: `import { component\$, useSignal, useTask\$ } from '@qwik.dev/core';

export default component\$(() => {
  const time = useSignal('');

  useTask\$(({ track, cleanup }) => {
    const id = setInterval(() => {
      time.value = new Date().toLocaleTimeString();
    }, 1000);

    cleanup(() => clearInterval(id));
  });

  return <time>{time.value}</time>;
});`,
      },
      {
        type: "p",
        text: "注意：上面的 `useTask$` 没有跟踪状态，因此只运行一次。计时器带来的后续更新由 `setInterval` 触发。",
      },
      { type: "h2", text: "用 track() 响应状态变化" },
      {
        type: "p",
        text: "把 signal 传给 `track()`，任务会在它变化时重新运行。重新运行总是发生在浏览器，响应式是客户端行为。",
      },
      {
        type: "code",
        code: `useTask\$(({ track }) => {
  const query = track(searchInput);
  console.log('搜索词变为', query);
});`,
      },
      {
        type: "p",
        text: "任务默认串行执行，异步任务会阻塞下一个任务。跟踪状态后的重复执行默认阻塞 DOM 更新；传入 `{ deferUpdates: true }` 可以让后续执行不阻塞更新。",
      },
      {
        type: "code",
        code: `useTask\$(
  ({ track }) => {
    track(count);
    return logToAnalytics(count.value);
  },
  { deferUpdates: true }
);`,
      },
      { type: "h2", text: "cleanup()" },
      {
        type: "p",
        text: "任务再次运行或组件卸载时，注册的清理函数会执行。取消请求、清除定时器、移除手动绑定的事件都应该放在这里。",
      },
      {
        type: "code",
        code: `useTask\$(async ({ track, cleanup }) => {
  track(query);
  const controller = new AbortController();
  cleanup(() => controller.abort());

  const res = await fetch(\`/api/search?q=\${query.value}\`, {
    signal: controller.signal,
  });
  results.value = await res.json();
});`,
      },
      { type: "h2", text: "useVisibleTask$()" },
      {
        type: "p",
        text: "需要真实 DOM 时用 `useVisibleTask$`。它在浏览器渲染后运行，默认在组件进入视口时执行。代价是它会提前加载框架核心与任务代码，因此应当作为最后手段。",
      },
      {
        type: "code",
        code: `useVisibleTask\$(({ cleanup }) => {
  const observer = new IntersectionObserver((entries) => {
    visible.value = entries[0]?.isIntersecting ?? false;
  });
  observer.observe(ref.value!);
  cleanup(() => observer.disconnect());
});`,
      },
      {
        type: "p",
        text: "确实需要立即运行时，可以传 `{ strategy: 'document-ready' }` 或 `{ strategy: 'document-idle' }`。前者在应用启动后马上运行，后者等到空闲。",
      },
      {
        type: "callout",
        tone: "tip",
        title: "先问能不能不用",
        text: "能用 `useTask$`、`useOnWindow` 或 `useOnDocument` 解决时，不要用 `useVisibleTask$`。它的优点是直接，缺点是会让 JavaScript 提前到达。",
      },
      { type: "h2", text: "Hook 规则" },
      {
        type: "p",
        text: "所有 `use*` hook 只能出现在 `component$` 的根部，或另一个 `use*` hook 的根部。不要放进条件分支、事件处理函数或 `$()` 包装的闭包里。",
      },
    ],
  },
  {
    slug: "core/context",
    section: "core",
    title: "上下文",
    navTitle: "上下文",
    description: "用 createContextId、useContextProvider 与 useContext 跨层共享状态。",
    keywords: ["useContext", "useContextProvider", "createContextId", "props drilling"],
    blocks: [
      {
        type: "p",
        text: "上下文用于跨越多层组件共享状态，避免把 props 一层层传下去。Qwik 的上下文由三部分组成：一个不可变的 id、一个 provider、一个 consumer。",
      },
      {
        type: "code",
        title: "src/components/theme-context.ts",
        code: `import { createContextId, type Signal } from '@qwik.dev/core';

export const ThemeContext = createContextId<Signal<'light' | 'dark'>>(
  'app.theme'
);`,
      },
      {
        type: "code",
        title: "提供与读取",
        code: `import { component\$, useContext, useContextProvider, useSignal } from '@qwik.dev/core';
import { ThemeContext } from './theme-context';

export const Root = component\$(() => {
  const theme = useSignal<'light' | 'dark'>('light');
  useContextProvider(ThemeContext, theme);
  return <Child />;
});

export const Child = component\$(() => {
  const theme = useContext(ThemeContext);
  return <button onClick\$={() => (theme.value = 'dark')}>切换</button>;
});`,
      },
      { type: "h2", text: "三个 API 的职责" },
      {
        type: "list",
        items: [
          "`createContextId<T>(name)`：创建一个类型化的 id，本身不保存状态，可以在模块顶层复用。",
          "`useContextProvider(id, value)`：把值提供给当前组件及其后代，不会全局可见。",
          "`useContext(id)`：读取最近一层 provider 提供的值。",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "SSR 序列化",
        text: "如果上下文在 SSR 期间没有被任何后代读取，它不会被序列化，浏览器端可能拿不到。需要客户端可用时，在父组件里也调用一次 `useContext()`，强制它进入序列化图。",
      },
      { type: "h2", text: "放什么进上下文" },
      {
        type: "p",
        text: "上下文适合放 signal、store、配置对象和服务实例。值同样需要遵守可序列化边界：服务端创建、客户端使用的对象应当可序列化；浏览器专属实例请用 `noSerialize()` 或在客户端重新创建。",
      },
      {
        type: "code",
        code: `const UserContext = createContextId<{ name: string }>('app.user');

useContextProvider(UserContext, { name: 'Ada' });`,
      },
      { type: "h2", text: "什么时候不用上下文" },
      {
        type: "list",
        items: [
          "只有一层父子关系时，props 更直观。",
          "只有单个页面使用的数据，放在路由组件内部即可。",
          "需要全局单例且跨路由共享时，可以放在根布局的 provider 中。",
        ],
      },
    ],
  },
];
