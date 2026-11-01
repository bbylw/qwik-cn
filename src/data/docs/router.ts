import type { Doc } from "./types";

export const routerDocs: Doc[] = [
  {
    slug: "routing",
    section: "router",
    title: "文件路由",
    navTitle: "文件路由",
    description: "用目录与 index 文件描述 URL，页面、端点与布局各司其职。",
    keywords: ["路由", "routing", "layout", "动态路由", "Link", "useNavigate"],
    blocks: [
      {
        type: "p",
        text: "Qwik Router 是文件系统路由：`src/routes` 下的目录与文件直接决定 URL 结构。你不需要维护一张路由表，新增页面就是新增文件。",
      },
      {
        type: "code",
        title: "src/routes 目录",
        lang: "text",
        code: `src/
└── routes/
    ├── layout.tsx              # 根布局
    ├── index.tsx               # /
    ├── about/
    │   └── index.tsx           # /about
    ├── blog/
    │   ├── layout.tsx          # /blog/* 的布局
    │   ├── index.tsx           # /blog
    │   └── [slug]/
    │       └── index.tsx       # /blog/hello-world
    ├── api/
    │   └── stats/
    │       └── index.ts        # JSON 端点
    └── [...missing]/
        └── index.tsx           # 兜底页面`,
      },
      { type: "h2", text: "三种文件，三种职责" },
      {
        type: "table",
        head: ["文件", "职责", "返回"],
        rows: [
          ["index.tsx", "页面组件", "渲染后的 HTML"],
          ["index.ts", "HTTP 端点", "JSON、文本或其他响应"],
          ["layout.tsx", "共享 UI 与中间件", "包含 <Slot /> 的页面"],
        ],
      },
      {
        type: "code",
        title: "src/routes/about/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';

export default component\$(() => {
  return <h1>关于我们</h1>;
});`,
      },
      {
        type: "p",
        text: "`index.ts` 不导出组件，而是导出 `onGet`、`onPost` 等请求处理函数。它适合 REST 接口、Webhook 与文件下载。",
      },
      {
        type: "code",
        title: "src/routes/api/stats/index.ts",
        code: `import type { RequestHandler } from '@qwik.dev/router';

export const onGet: RequestHandler = ({ json }) => {
  json(200, { online: true });
};`,
      },
      { type: "h2", text: "动态路由" },
      {
        type: "p",
        text: "方括号目录表示动态段。`[slug]` 匹配一个路径段，`[...all]` 匹配剩余所有段，参数从 `useLocation()` 的 `params` 读取。",
      },
      {
        type: "code",
        title: "src/routes/blog/[slug]/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';
import { useLocation } from '@qwik.dev/router';

export default component\$(() => {
  const loc = useLocation();
  return <h1>文章：{loc.params.slug}</h1>;
});`,
      },
      {
        type: "table",
        head: ["文件", "匹配的 URL", "params"],
        rows: [
          ["routes/user/[username]/index.tsx", "/user/foo", "{ username: 'foo' }"],
          ["routes/post/[...all]/index.tsx", "/post/2026/11/qwik", "{ all: '2026/11/qwik' }"],
          ["routes/shop/[category]/[id]/index.tsx", "/shop/book/42", "{ category: 'book', id: '42' }"],
        ],
      },
      { type: "h2", text: "路由优先级" },
      {
        type: "p",
        text: "多条路由同时匹配时，Qwik Router 从左到右逐段比较：静态段优先于 `[param]`，`[param]` 优先于 `[...catchAll]`。目录顺序与括号分组不影响结果。",
      },
      {
        type: "code",
        lang: "text",
        code: `/pricing                      → pricing/index.tsx
/news/feed.xml                → [section]/feed.xml/index.ts
/news/today                   → [section]/[topic]/index.tsx
/acme/settings/billing        → [org]/[...path]/index.tsx`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "兜底页写在哪",
        text: "把 `[...missing]/index.tsx` 放在 routes 根目录即可接住所有未匹配的 URL，在其中抛出 404 或渲染自定义页。",
      },
      { type: "h2", text: "布局" },
      {
        type: "p",
        text: "`layout.tsx` 同时承担两件事：包裹子路由的 UI，以及在渲染前执行的中间件。子页面通过 `<Slot />` 插入布局内容。",
      },
      {
        type: "code",
        title: "src/routes/layout.tsx",
        code: `import { component\$, Slot } from '@qwik.dev/core';

export default component\$(() => {
  return (
    <div class="shell">
      <header>Qwik 中文站点</header>
      <main>
        <Slot />
      </main>
    </div>
  );
});`,
      },
      {
        type: "p",
        text: "布局可以嵌套，请求也会逐层经过每一级的 `onRequest`。例如 `/admin/users` 会依次执行根布局、`admin/layout.tsx`、页面自身的处理函数。",
      },
      { type: "h2", text: "SPA 导航" },
      {
        type: "p",
        text: "`<Link>` 渲染一个真正的 `<a>` 标签：没有 JavaScript 时是普通页面跳转，有 JavaScript 时升级为 SPA 导航。优先使用它，而不是在按钮里手写跳转。",
      },
      {
        type: "code",
        code: `import { component\$ } from '@qwik.dev/core';
import { Link, useNavigate } from '@qwik.dev/router';

export default component\$(() => {
  const nav = useNavigate();
  return (
    <nav>
      <Link href="/docs/">文档</Link>
      <button onClick\$={() => nav('/about')}>关于</button>
    </nav>
  );
});`,
      },
      {
        type: "table",
        head: ["写法", "行为"],
        rows: [
          ["<Link href=\"/docs/\">", "可访问的页面跳转，支持预取"],
          ["<Link reload>", "重新执行当前路由的 loader 并刷新"],
          ["useNavigate()('/path')", "在代码中触发导航"],
          ["useNavigate()()", "刷新当前页面"],
        ],
      },
      {
        type: "p",
        text: "`<Link>` 默认在链接进入视口时预取路由代码，在用户表现出点击意图时预取数据。滚动位置由浏览器 history 恢复，刷新、前进后退都不会闪动。",
      },
      {
        type: "callout",
        tone: "note",
        title: "URL 是唯一输入",
        text: "布局与页面应把路由参数、查询参数当作唯一数据来源。这样 SSR、SPA 导航和直接打开链接三条路径才能渲染出一致的结果。",
      },
    ],
  },
  {
    slug: "route-loader",
    section: "router",
    title: "数据加载",
    navTitle: "routeLoader$",
    description: "在服务端加载数据，返回可直接读取的 ComputedSignal。",
    keywords: ["routeLoader", "loader", "数据加载", "ComputedSignal", "缓存"],
    blocks: [
      {
        type: "p",
        text: "`routeLoader$()` 定义只在服务端执行的数据加载函数。它在 SSR 时运行一次，SPA 导航到对应路由时再次运行，返回一个 `ComputedSignal`，组件用 `.value` 读取。",
      },
      {
        type: "code",
        title: "src/routes/product/[id]/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';
import { routeLoader\$ } from '@qwik.dev/router';

export const useProduct = routeLoader\$(async ({ params }) => {
  const res = await fetch(\`https://api.example.com/products/\${params.id}\`);
  return res.json();
});

export default component\$(() => {
  const product = useProduct();
  return <h1>{product.value.name}</h1>;
});`,
      },
      {
        type: "p",
        text: "loader 必须从 `index.tsx` 或 `layout.tsx` 导出。跨路由复用时，在独立文件中定义，再从每个需要它的路由文件重新导出。",
      },
      { type: "h2", text: "三个关键性质" },
      {
        type: "list",
        items: [
          "**只在服务端运行**：函数体不会进入客户端 bundle，数据库查询与密钥都安全。",
          "**按路由缓存**：同一 URL 的多次调用共享一份结果，而不是每个组件各请求一次。",
          "**返回 ComputedSignal**：读取 `.value` 得到数据；数据未就绪时读取会挂起，出错时重新抛出错误。",
        ],
      },
      {
        type: "p",
        text: "一个页面可以声明多个 loader，它们并行执行。声明更多 loader 本身不会拖慢渲染。",
      },
      {
        type: "code",
        code: `export const useSession = routeLoader\$(({ cookie }) => {
  return { token: cookie.get('session')?.value ?? null };
});

export const useTodos = routeLoader\$(async ({ sharedMap }) => {
  return db.todos.list();
});`,
      },
      { type: "h2", text: "把 RequestEvent 当作入口" },
      {
        type: "table",
        head: ["属性", "用途"],
        rows: [
          ["params", "动态路由参数"],
          ["url", "完整 URL，含查询参数"],
          ["cookie", "读取或写入 Cookie"],
          ["request", "原始 Request 对象，可读 Header"],
          ["env", "平台注入的环境变量"],
          ["fail / error / redirect", "失败、抛出状态码、重定向"],
          ["sharedMap", "在本次请求的多个处理函数间共享数据"],
        ],
      },
      {
        type: "code",
        code: `export const useArticle = routeLoader\$(async ({ params, fail }) => {
  const article = await db.articles.find(params.slug);
  if (!article) {
    return fail(404, { message: '文章不存在' });
  }
  return article;
});`,
      },
      {
        type: "p",
        text: "`return fail(status, data)` 把失败作为数据返回，组件通过 `signal.value.failed` 判断；`throw error(status)` 则让读取 `.value` 时抛出错误，需要在 `<Catch>` 中处理。",
      },
      {
        type: "callout",
        tone: "warn",
        title: "loader 不能读取 action 的结果",
        text: "loader 的输出必须是 URL 的纯函数。表单提交后的临时状态请直接从 action 的 signal 读取，再与 loader 数据组合展示。",
      },
      { type: "h2", text: "缓存与序列化" },
      {
        type: "p",
        text: "Qwik Router 把每个 loader 的结果暴露为独立 JSON 端点，浏览器 HTTP 缓存是唯一的新鲜度权威。默认 `no-cache`：每次导航都重新验证，配合 ETag 通常只返回 304。",
      },
      {
        type: "table",
        head: ["选项", "默认值", "作用"],
        rows: [
          ["cacheControl", "'no-cache'", "设置 loader JSON 的 Cache-Control"],
          ["eTag", "—", "命中时返回 304，跳过 loader"],
          ["search", "[]", "声明依赖哪些查询参数"],
          ["serializationStrategy", "'never'", "是否把数据内嵌进 HTML"],
          ["blockSSR", "true", "是否等待 loader 完成再渲染"],
        ],
      },
      {
        type: "code",
        code: `export const useCatalog = routeLoader\$(
  async ({ url }) => {
    return db.products.list({
      category: url.searchParams.get('category'),
    });
  },
  {
    cacheControl: 60,
    search: ['category'],
  }
);`,
      },
      {
        type: "p",
        text: "默认情况下 loader 数据不会写进 HTML：首屏立即返回，客户端恢复后再按需请求 JSON。如果数据很小且首屏必须可见，可设 `serializationStrategy: 'always'`，代价是 HTML 变大。",
      },
      {
        type: "callout",
        tone: "tip",
        title: "等待状态",
        text: "懒加载的数据在客户端可能短暂未就绪。用 `<Pending>` 包住读取者显示占位，用 `<Catch>` 处理抛出的错误。",
      },
    ],
  },
  {
    slug: "action",
    section: "router",
    title: "表单与变更",
    navTitle: "routeAction$",
    description: "用 routeAction$ 与 <Form> 处理写操作，没有 JavaScript 也能提交。",
    keywords: ["routeAction", "globalAction", "Form", "表单", "zod", "invalidate"],
    blocks: [
      {
        type: "p",
        text: "`routeAction$()` 定义只在服务端执行、且只在被显式调用时运行的操作。它适合写数据库、发邮件、创建订单这类有副作用的逻辑。",
      },
      {
        type: "code",
        title: "src/routes/signup/index.tsx",
        code: `import { component\$ } from '@qwik.dev/core';
import { routeAction\$, Form } from '@qwik.dev/router';

export const useSignup = routeAction\$(async (data) => {
  const user = await db.users.create({
    name: data.name,
    email: data.email,
  });
  return { success: true, id: user.id };
});

export default component\$(() => {
  const signup = useSignup();
  return (
    <Form action={signup}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">创建账号</button>
      {signup.value?.success && <p>欢迎，{signup.value.id}</p>}
    </Form>
  );
});`,
      },
      { type: "h2", text: "<Form> 的双重身份" },
      {
        type: "list",
        items: [
          "没有 JavaScript 时，它就是一个普通 HTML 表单，浏览器直接 POST 到 action 端点。",
          "有 JavaScript 时，它拦截提交，在 SPA 中调用 action，不刷新页面。",
          "action 完成后，可自动刷新被 invalidate 的 loader，让页面数据保持一致。",
        ],
      },
      {
        type: "p",
        text: "提交过程中 `action.isRunning` 为 `true`，适合禁用按钮或显示进度。`action.formData` 保留上一次提交的字段，刷新后也能回填。",
      },
      {
        type: "code",
        code: `<button type="submit" disabled={signup.isRunning}>
  {signup.isRunning ? '提交中…' : '创建账号'}
</button>`,
      },
      { type: "h2", text: "校验与失败" },
      {
        type: "p",
        text: "Qwik Router 内置与 Zod 的集成：`zod$()` 在 action 执行前校验表单，类型会自动收窄；失败信息进入 `fieldErrors`。`zod$` 从 `@qwik.dev/router` 导入，回调参数就是 zod 实例（项目里需要先装 `zod`）。",
      },
      {
        type: "code",
        code: `import { routeAction\$, zod\$ } from '@qwik.dev/router';

export const useSignup = routeAction\$(
  async (data) => {
    const user = await db.users.create(data);
    return { success: true, id: user.id };
  },
  zod\$((z) => ({
    name: z.string().min(2),
    email: z.string().email(),
  }))
);`,
      },
      {
        type: "code",
        code: `<input name="email" />
{signup.value?.failed && (
  <p role="alert">{signup.value.fieldErrors.email}</p>
)}`,
      },
      {
        type: "p",
        text: "业务层失败使用 `fail(status, data)` 返回，而不是抛异常。这样页面仍能渲染，用户看到的是可恢复的错误提示。",
      },
      {
        type: "code",
        code: `if (!user) {
  return fail(409, { message: '邮箱已被注册' });
}`,
      },
      { type: "h2", text: "代码中调用" },
      {
        type: "p",
        text: "不是所有提交都来自表单。`action.submit(data)` 返回 Promise，适合按钮触发的操作或先做客户端校验。",
      },
      {
        type: "code",
        code: `const action = useDeleteTodo();

<button
  onClick\$={async () => {
    const { value } = await action.submit({ id: todo.id });
    if (value.failed) return;
    todos.value = todos.value.filter((t) => t.id !== todo.id);
  }}
>
  删除
</button>`,
      },
      { type: "h2", text: "routeAction$ 与 globalAction$" },
      {
        type: "table",
        head: ["", "routeAction$", "globalAction$"],
        rows: [
          ["声明位置", "routes 下的 index/layout", "src 任意位置"],
          ["作用域", "当前路由", "全站"],
          ["典型场景", "受保护页面、路由相关写操作", "登录、全局搜索、共享操作"],
        ],
      },
      {
        type: "p",
        text: "表单提交后想跳转，在 action 中 `throw redirect(303, '/done')`。当 JavaScript 关闭时，这会形成 Post/Redirect/Get 流程，刷新结果页不会重复提交。",
      },
      {
        type: "callout",
        tone: "tip",
        title: "让 loader 保持纯粹",
        text: "action 写入数据库后，通过 invalidate 让 routeLoader$ 重新读取权威数据；不要把 action 的返回值塞进 loader，直接用 action.value 渲染临时反馈即可。",
      },
    ],
  },
  {
    slug: "server",
    section: "router",
    title: "服务端函数",
    navTitle: "server$",
    description: "用 server$ 把任意函数变成类型安全的 RPC，同时保留 RequestEvent。",
    keywords: ["server$", "RPC", "服务端", "RequestEvent", "server-only"],
    blocks: [
      {
        type: "p",
        text: "`server$()` 把一个函数变成客户端可调用的 RPC。调用方拿到的仍是普通异步函数，但函数体只在服务器上执行，参数与返回值经过 Qwik 序列化。",
      },
      {
        type: "code",
        title: "src/routes/contact/index.tsx",
        code: `import { component\$, useSignal } from '@qwik.dev/core';
import { server\$ } from '@qwik.dev/router';

export const sendMessage = server\$(async function (name: string) {
  await mailer.send({
    to: 'hello@example.com',
    subject: \`来自 \${name} 的消息\`,
  });
  return { ok: true };
});

export default component\$(() => {
  const name = useSignal('');
  const status = useSignal('');

  return (
    <form
      preventdefault:submit
      onSubmit\$={async () => {
        const res = await sendMessage(name.value);
        status.value = res.ok ? '已发送' : '失败';
      }}
    >
      <input bind:value={name} />
      <button type="submit">发送</button>
      <p>{status.value}</p>
    </form>
  );
});`,
      },
      {
        type: "p",
        text: "参数可以是原始值、对象、数组、Date、Map、Set、Promise 以及可序列化的 QRL。不能传类实例、函数或流；需要传 DOM 引用时用 `noSerialize()` 明确标注。",
      },
      { type: "h2", text: "在服务端拿到请求上下文" },
      {
        type: "p",
        text: "`server$` 函数中的 `this` 是 `RequestEvent`。你可以读取 Cookie、Header、URL 与环境变量，也可以写响应 Cookie。",
      },
      {
        type: "code",
        code: `export const whoami = server\$(function () {
  const session = this.cookie.get('session')?.value;
  const token = this.env.get('API_TOKEN');
  return {
    session: session ?? null,
    authorized: Boolean(session && token),
  };
});`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "SSR 阶段不要写 Cookie",
        text: "首屏 HTML 是流式输出的，在 useTask$ 或 SSR 中设置 Cookie 可能来不及写入响应头。初始请求的 Cookie 请在 middleware 或插件中处理。",
      },
      { type: "h2", text: "可取消的调用" },
      {
        type: "p",
        text: "当调用方传入 `AbortSignal` 时，`server$` 函数会把它作为第一个参数注入。连接断开后你可以提前终止长任务。",
      },
      {
        type: "code",
        code: `export const search = server\$(async function (
  signal: AbortSignal,
  query: string
) {
  const res = await fetch(
    \`https://api.example.com/search?q=\${encodeURIComponent(query)}\`,
    { signal }
  );
  return res.json();
});

// 调用
const controller = new AbortController();
const result = await search(controller.signal, 'qwik');`,
      },
      { type: "h2", text: "什么该放在服务端" },
      {
        type: "table",
        head: ["需求", "首选"],
        rows: [
          ["页面渲染前需要数据", "routeLoader$"],
          ["表单写操作", "routeAction$"],
          ["按钮触发的任意服务端逻辑", "server$"],
          ["对外提供 REST / Webhook", "index.ts 端点"],
          ["数据库、密钥、第三方 SDK", ".server.ts 模块"],
        ],
      },
      {
        type: "p",
        text: "文件名包含 `.server.` 或位于 `src/**/server/**` 的模块只允许服务端代码导入。客户端若误引，构建会直接失败，而不是把密钥悄悄打进 bundle。",
      },
      {
        type: "code",
        title: "src/db.server.ts",
        lang: "ts",
        code: `export async function findUser(id: string) {
  return db.users.find(id);
}`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "先问需不需要网络",
        text: "能在构建期或 SSR 算完的内容，不必变成 RPC。server$ 是边界，不是默认选项；每多一次调用就多一次网络往返。",
      },
    ],
  },
];
