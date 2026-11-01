import type { Doc } from "./types";

export const startDocs: Doc[] = [
  {
    slug: "getting-started",
    section: "start",
    title: "快速开始",
    description: "创建 Qwik 应用，认识路由、数据加载、状态与表单。",
    keywords: ["安装", "CLI", "bun create qwik", "第一个应用", "快速上手"],
    blocks: [
      {
        type: "p",
        text: "Qwik 应用由服务端渲染器、文件路由和一组按需加载的符号组成。你不需要先规划代码分割，Optimizer 会在构建时完成这件事。",
      },
      {
        type: "p",
        text: "这条路径用 Qwik Router 创建一个完整应用。想先理解设计思想，可以先读[心智模型](/docs/concepts/think-qwik/)。",
      },
      { type: "h2", text: "创建项目" },
      {
        type: "code",
        lang: "bash",
        title: "终端",
        code: `bun create qwik@latest

# 或使用其他包管理器
npm create qwik@latest
pnpm create qwik@latest
yarn create qwik@latest`,
      },
      {
        type: "p",
        text: "CLI 会询问项目名与模板。选择 `playground` 会得到包含 Qwik Router、示例路由和开发脚本的完整项目。",
      },
      {
        type: "callout",
        tone: "note",
        title: "环境",
        text: "需要 Node.js 20.19+ 或 22.12+。这是 Vite 8 构建链的硬性要求，项目模板的 `engines` 字段与之一致，低于该版本构建会失败。",
      },
      { type: "h2", text: "启动开发服务器" },
      {
        type: "code",
        lang: "bash",
        title: "终端",
        code: `cd my-app
bun install
bun run dev`,
      },
      {
        type: "p",
        text: "开发服务器默认运行在 `http://localhost:5173`。命令与包管理器无关，用你习惯的工具即可。",
      },
      { type: "h2", text: "创建第一个路由" },
      {
        type: "p",
        text: "`src/routes` 下的目录就是 URL。新建 `src/routes/hello/index.tsx`，默认导出一个组件：",
      },
      {
        type: "code",
        title: "src/routes/hello/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';

export default component\$(() => {
  return <h1>你好，Qwik</h1>;
});`,
      },
      {
        type: "p",
        text: "访问 `/hello/` 就能看到页面。路由文件、`layout.tsx` 和 `root.tsx` 必须使用默认导出；其他组件可以用命名导出。",
      },
      { type: "h2", text: "从服务端加载数据" },
      {
        type: "p",
        text: "`routeLoader$` 在服务端执行，把结果序列化进 HTML。组件里调用返回的 hook，读取 `.value`：",
      },
      {
        type: "code",
        title: "src/routes/hello/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';
import { routeLoader\$ } from '@qwik.dev/router';

export const useGreeting = routeLoader\$(async () => {
  return { message: '这份数据来自服务端' };
});

export default component\$(() => {
  const greeting = useGreeting();
  return <p>{greeting.value.message}</p>;
});`,
      },
      {
        type: "p",
        text: "loader 的函数体不会发送到浏览器。页面首次渲染时，数据已经随 HTML 到达。",
      },
      { type: "h2", text: "让页面响应交互" },
      {
        type: "p",
        text: "用 `useSignal` 保存状态，用 `onClick$` 注册事件。事件处理代码是一个独立的 QRL，只在第一次交互时下载：",
      },
      {
        type: "code",
        title: "src/routes/hello/index.tsx",
        code: `import { component\$, useSignal } from '@qwik.dev/core';

export default component\$(() => {
  const count = useSignal(0);
  return (
    <button onClick\$={() => count.value++}>
      点击了 {count.value} 次
    </button>
  );
});`,
      },
      { type: "demo", kind: "counter" },
      { type: "h2", text: "提交表单" },
      {
        type: "p",
        text: "`routeAction$` 处理服务端变更，`<Form>` 使用原生表单语义。开启 JavaScript 时走 SPA 提交，关闭 JavaScript 时浏览器照常 POST：",
      },
      {
        type: "code",
        title: "src/routes/hello/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';
import { Form, routeAction\$ } from '@qwik.dev/router';

export const useSubscribe = routeAction\$(async (data) => {
  await db.subscribers.add(data.email);
  return { success: true };
});

export default component\$(() => {
  const subscribe = useSubscribe();

  return (
    <Form action={subscribe}>
      <input type="email" name="email" required />
      <button type="submit">订阅</button>
      {subscribe.value?.success && <p>已订阅</p>}
    </Form>
  );
});`,
      },
      { type: "h2", text: "添加组件样式" },
      {
        type: "p",
        text: "Qwik 支持普通的 CSS 导入。需要把样式限定在组件内时，用 `?inline` 导入并交给 `useStylesScoped$`：",
      },
      {
        type: "code",
        title: "src/routes/hello/index.tsx",
        code: `import { component\$, useStylesScoped\$ } from '@qwik.dev/core';
import styles from './card.css?inline';

export default component\$(() => {
  useStylesScoped\$(styles);
  return <article class="card">一张卡片</article>;
});`,
      },
      { type: "h2", text: "验证生产构建" },
      {
        type: "p",
        text: "开发服务器按文件提供模块，不能代表生产网络表现。运行预览命令，观察构建后的符号拆分与预加载：",
      },
      {
        type: "code",
        lang: "bash",
        title: "终端",
        code: "bun run preview",
      },
      {
        type: "callout",
        tone: "warn",
        title: "开发与预览不同",
        text: "Speculative Module Fetching 只在 preview 与生产构建中完整工作。性能问题请始终在 preview 模式下复现。",
      },
      { type: "h2", text: "接下来" },
      {
        type: "list",
        items: [
          "读[心智模型](/docs/concepts/think-qwik/)，理解 JavaScript streaming。",
          "看[可恢复性](/docs/concepts/resumable/)，了解状态如何写进 HTML。",
          "进入[路由](/docs/routing/)与[数据加载](/docs/route-loader/)，搭建完整应用。",
        ],
      },
    ],
  },
  {
    slug: "project-structure",
    section: "start",
    title: "项目结构",
    description: "理解 Qwik Router 的入口文件、路由目录与请求生命周期。",
    keywords: ["目录", "entry.ssr", "root.tsx", "routes", "layout"],
    blocks: [
      {
        type: "p",
        text: "Qwik 的目录结构把服务器入口、文档外壳和路由分开。大部分业务代码活在 `src/routes` 与 `src/components` 里，框架配置只在少数几个文件中出现。",
      },
      { type: "h2", text: "默认目录" },
      {
        type: "code",
        lang: "text",
        title: "项目根目录",
        code: `src/
  root.tsx            文档的 <head> 与 <body>
  entry.ssr.tsx       服务端渲染入口
  entry.preview.tsx   preview 用的 Node 中间件
  routes/
    layout.tsx        所有页面共享的布局
    index.tsx         首页 /
    docs/
      layout.tsx      文档区布局
      [...slug]/
        index.tsx     动态文档页
  components/
    site/             页头、页脚、主题切换
    docs/             文档排版与代码块
    home/             首页交互演示
  data/
    docs/             文档内容与索引
  styles/             设计令牌与全局样式
public/               静态资源
vite.config.ts        Vite + Qwik 插件配置
tsconfig.json         TypeScript 配置`,
      },
      { type: "h2", text: "入口文件" },
      {
        type: "table",
        head: ["文件", "职责"],
        rows: [
          ["`src/root.tsx`", "返回 `<head>` 与 `<body>`，挂载 `RouterOutlet`，决定全局 head 内容。"],
          ["`src/entry.ssr.tsx`", "用 `createRenderer` 把根组件交给 Qwik Router，设置语言、容器属性与默认 head。"],
          ["`src/entry.preview.tsx`", "生产预览用的 Node 中间件，只在 `preview` 与部署适配器中使用。"],
          ["`vite.config.ts`", "注册 `qwikRouter()` 与 `qwikVite()` 插件，配置 Vite 优化项。"],
        ],
      },
      { type: "h2", text: "路由文件的三种角色" },
      {
        type: "list",
        items: [
          "`index.tsx`：页面。默认导出 `component$`，渲染 HTML 响应。",
          "`index.ts`：端点。导出 `onGet`、`onPost` 等 handler，直接返回 JSON、文本或重定向。",
          "`layout.tsx`：布局。为子路由提供共享 UI，也可以实现 `onRequest` 等请求拦截逻辑。",
        ],
      },
      {
        type: "code",
        lang: "text",
        title: "src/routes",
        code: `routes/
  layout.tsx                 所有页面共享
  index.tsx                  /
  about/
    index.tsx                /about
  docs/
    layout.tsx               /docs/*
    [section]/
      index.tsx              /docs/:section
    [...slug]/
      index.tsx              /docs/任意/深层/路径
  api/
    products/
      index.ts               /api/products（JSON 端点）`,
      },
      {
        type: "p",
        text: "静态段优先于 `[param]`，`[param]` 优先于 `[...catchAll]`。路由匹配按段从左到右比较，与目录创建顺序无关。",
      },
      { type: "h2", text: "一次请求的顺序" },
      {
        type: "steps",
        items: [
          { title: "SSR 入口", text: "`entry.ssr.tsx` 创建渲染器，接收请求。" },
          { title: "中间件", text: "`plugin@*.ts` 与布局的 `onRequest` 依次运行。" },
          { title: "数据加载", text: "全局 loader 与当前路由的 `routeLoader$` 在组件渲染前完成。" },
          { title: "渲染", text: "根布局、嵌套布局、页面组件依次输出 HTML。" },
          { title: "序列化", text: "组件边界、事件与状态写入 HTML，浏览器之后从这里续接。" },
        ],
      },
      { type: "h2", text: "服务端专用模块" },
      {
        type: "p",
        text: "以 `.server.ts` 结尾的文件，以及 `src/**/server/**` 下的模块，只能在 SSR 代码、loader、action、端点和 `server$` 中导入。客户端代码如果误引入，构建会失败：",
      },
      {
        type: "code",
        title: "src/db.server.ts",
        code: `export const findUser = async (id: string) => {
  return db.users.findUnique({ where: { id } });
};`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "默认导出规则",
        text: "`root.tsx`、`layout.tsx` 与路由 `index.tsx` 必须有默认导出。普通组件没有这条限制，但建议保持命名导出，便于 Optimizer 提取符号。",
      },
    ],
  },
];
